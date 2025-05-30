<?php

use App\Channel\Consumer;
use App\Render\Inertia;
use Oktaax\Http\Request;
use Oktaax\Http\Response;
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

$app->setServer('task_worker_num', 2);
$app->setServer('task_enable_coroutine', true);

$app->setView(new PhpView(__DIR__ . "/../resources/views"));
$app->documentRoot(__DIR__ . "/../public/");
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

$app->gate(function ($serv, $req) {
    if ($req->queryHas('token') && $req->get['token'] === 'rahasia') {
        SupportTable::add($req->fd, ['is_esp' => 1]);
    };
});

$app->on("Task", function ($server, Task $task) use ($pool) {
    $pdo = $pool->get();

    try {
        $msg = json_decode($task->data);
        $data = $msg->data;

        $stmt = $pdo->prepare("INSERT INTO `history` (lux, temp, dust) VALUES (:l, :t,:d)");
        $stmt->execute([
            ':l' => $data->lux,
            ':t' => $data->temp,
            ':d' => $data->dust,
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
$app->get("/", function (Request $req, Response $res)  {
 
    echo "jepi ganteng";
    Inertia::render($req, $res, ["component" => "Index"]);
});

$app->get("/test", function (Request $req, Response $res) use ($pool) {
    Inertia::render($req, $res, ["component" => "Test2"]);
});
$app->get("/chart", function (Request $req, Response $res) {
    Inertia::render($req, $res, ["component" => "Charts"]);
});

$app->get("/history", function (Request $req, Response $res) use ($pool) {
    $pdo = $pool->get();
    try {
        $result =   $pdo->query("SELECT * FROM env");
        $result->fetchAll();
        $res->render('history');
    } catch (\Throwable $th) {
        $res->status(500)->end();
    } finally {
        $pool->put($pdo);
    }
});



$app->ws("publish", function ($server, $client) {
    if (SupportTable::find($client->fd)) {
        xserver()->task($client->data);
        $server->toChannel(Consumer::class)->broadcast();
    } else {
        $server->reply("not allowed");
    }
});



return $app;
