<?php

use Swoole\Http\Server;
use Swoole\ConnectionPool;
use Swoole\Runtime;
use Swoole\Database\PDOConfig;
use Swoole\Database\PDOPool;
Runtime::enableCoroutine();

$server = new Server("127.0.0.1", 9501);

$server->set([
    "task_worker_num" => 2,
    "task_enable_coroutine" => true
]);


$server->on("WorkerStart", function () use ($pool) {
    $pool->fill();
    echo "Connection pool filled.\n";
});

$server->on("Request", function ($req, $res) use ($pool, $server) {
    go(function () use ($res, $pool, $server) {
        $pdo = $pool->get();

        $server->task(["id" => 1, "handler" => function () {
            echo "task 1 handler";
        }]);

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

$server->on("Task", function ($server, $task) {
    $task->data["handler"]();
    $task->finish("");
});
$server->on("Finish", function () {
    echo "finish";
});

$server->on("WorkerExit", function () use ($pool) {
    $pool->close();
    echo "Connection pool closed.\n";
});

$server->start();
