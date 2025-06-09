<?php

use App\Service\Scanner;
use Oktaax\Oktaax;
use Swoole\Http\Server;
use Swoole\ConnectionPool;
use Swoole\Runtime;
use Swoole\Database\PDOConfig;
use Swoole\Database\PDOPool;

require_once __DIR__ . "/vendor/autoload.php";

// $scan = new Scanner;
// $scan->find();
// Runtime::enableCoroutine();

// $server = new Server("127.0.0.1", 9501);

// $server->set([
//     "task_worker_num" => 2,
//     "task_enable_coroutine" => true
// ]);


// $server->on("WorkerStart", function () use ($pool) {
//     $pool->fill();
//     echo "Connection pool filled.\n";
// });

// $server->on("Request", function ($req, $res) use ($pool, $server) {
//     go(function () use ($res, $pool, $server) {
//         $pdo = $pool->get();

//         $server->task(["id" => 1, "handler" => function () {
//             echo "task 1 handler";
//         }]);

//         if (!$pdo) {
//             $res->status(500);
//             $res->end("No available DB connection.");
//             return;
//         }

//         try {
//             $result = $pdo->query("SELECT NOW()");
//             $data = $result->fetch();

//             $res->header("Content-Type", "application/json");
//             $res->end(json_encode($data));
//         } catch (Throwable $e) {
//             $res->status(500);
//             $res->end("DB Error: " . $e->getMessage());
//         } finally {
//             $pool->put($pdo);
//         }
//     });
// });

// $server->on("Task", function ($server, $task) {
//     $task->data["handler"]();
//     $task->finish("");
// });
// $server->on("Finish", function () {
//     echo "finish";
// });

// $server->on("WorkerExit", function () use ($pool) {
//     $pool->close();
//     echo "Connection pool closed.\n";
// });

// $server->start();

function down($x, $a, $b)
{
   return $b - $x * ($b - $a);
}

function up($m, $a, $b)
{
   return $m * ($b - $a) + $a;
}

$decr = down(0.25, 2000, 8000);
$incr = up(0.6, 2000, 8000);

$num = ($decr * 0.25) + ($incr * 0.6);
$dem = 0.6 + 0.25;

echo $num / $dem . PHP_EOL;
