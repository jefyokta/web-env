<?php

use App\Channel\Consumer;
use App\Middleware\ContentType;
use App\Middleware\Debug;
use App\Render\Inertia;
use Oktaax\Oktaax;
use Oktaax\Trait\HasWebsocket;
use Oktaax\Views\PhpView;
use Oktaax\Websocket\Support\Table as SupportTable;
use Swoole\Server\Task;
use Swoole\Table;

$app = new class extends Oktaax {
    use HasWebsocket;
};


/**
 * @var \Swoole\ConnectionPool<\PDO>
 */
$pool = require __DIR__ . "/ConnectionPool.php";
$config =  require __DIR__ . "/../config/app.php";

$app->setServer('task_worker_num', 2);
$app->setServer('task_enable_coroutine', true);

$app->setView(new PhpView(__DIR__ . "/../resources/views"));

$app->documentRoot(__DIR__ . "/../public/");

if ($config["app"]["dev"]) {
    $app->use([Debug::class, "handle"]);
};

$app->use([ContentType::class, 'handle']);
$app->table(function (Table $table) {
    $table->column('is_esp', Table::TYPE_INT);
});

$app->on("WorkerStart", function ($server) use ($pool) {
    try {
        $pool->fill();
    } catch (\Exception $e) {
        throw $e;
        $server->shutdown();
    }
});

$app->on("WorkerExit", function () use ($pool) {
    $pool->close();
});

$app->gate(function ($serv, $req) {
    if ($req->queryHas('token') && $req->get['token'] === 'rahasia') {
        SupportTable::add($req->fd, ['is_esp' => 1]);
        $message = ["event" => "esp_update", "message" => true];
        $serv
            ->toChannel(Consumer::class)
            ->broadcast(json_encode($message));
    };
});

$app->on("Task", function ($server, Task $task) use ($pool) {
    $pdo = $pool->get();
    try {
        $msg = $task->data;
        $data = $msg["message"];

        $stmt = $pdo->prepare("INSERT INTO `history` (lux, temperature, dust) VALUES (:l, :t,:d)");

        $stmt->execute([
            ':l' => $data["lux"],
            ':t' => $data["temperature"],
            ':d' => $data["dust"],
        ]);
    } catch (Throwable $e) {
        echo "Task insert error: " . $e->getMessage() . "\n";
    } finally {
        $pool->put($pdo);
    }

    $task->finish("");
});

$app->on("Finish", function ($s, $id) {

    echo "finish $id\n";
});
$app->get("/", function () {


    Inertia::render("Index");
});

$app->get("/test", function () {
    Inertia::render("Test2");
});
$app->get("/chart", function () {
    Inertia::render("Charts");
});

$app->get("/history", function () {
    Inertia::render("History");
});

$app->ws("publish", function ($server, $client) {

    if (SupportTable::find($client->fd)) {
        xserver()->task($client->data);
        $server
            ->toChannel(Consumer::class)
            ->broadcast(json_encode($client->data));
    } else {
        $server->reply("not allowed");
    }
});

$app->ws("status", function ($server, $client) {
    $espConnected =  SupportTable::getTable()->count() > 0;
    $message = ["event" => "esp_update", "message" => $espConnected];
    $server->reply(json_encode($message));
});

$app->exit(function ($serv, $fd) {
    $info =  SupportTable::get($fd);
    if ($info && $info["is_esp"]) {
        $message = ["event" => "esp_update", "message" => false];
        foreach ($serv->connections as $con) {
            if ($serv->isEstablished($con) && $con !== $fd) {
                $serv->push($con, json_encode($message));
            }
        }
    }
    SupportTable::remove($fd);
});



return $app;
