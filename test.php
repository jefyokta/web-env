<?php

use Swoole\Http\Server;
use Swoole\ConnectionPool;
use Swoole\Runtime;

Runtime::enableCoroutine(); // Enable coroutine hook untuk PDO

$server = new Server("127.0.0.1", 9501);


// Pool global per worker
$pool = new ConnectionPool(function () {
    return new PDO(
        "mysql:host=127.0.0.1;dbname=test;charset=utf8mb4",
        "root",
        "", 
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
}, 5); // Max 5 koneksi per worker

$server->on("WorkerStart", function () use ($pool) {
    $pool->fill(); // Isi pool saat worker start
    echo "Connection pool filled.\n";
});

$server->on("Request", function ($req, $res) use ($pool) {
    go(function () use ($res, $pool) {
        $pdo = $pool->get(); // Ambil koneksi dari pool

        if (!$pdo) {
            $res->status(500);
            $res->end("No available DB connection.");
            return;
        }

        try {
            $result = $pdo->query("SELECT NOW()");
            $data = $result->fetch();

            $res->header("Content-Type", "application/json");
            $res->end(json_encode($data));
        } catch (Throwable $e) {
            $res->status(500);
            $res->end("DB Error: " . $e->getMessage());
        } finally {
            $pool->put($pdo); 
        }
    });
});

$server->on("WorkerExit", function () use ($pool) {
    $pool->close(); 
    echo "Connection pool closed.\n";
});

$server->start();
