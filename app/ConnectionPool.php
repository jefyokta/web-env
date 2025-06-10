<?php

use Swoole\ConnectionPool;

return new ConnectionPool(function () {
    $config = require __DIR__ . "/../config/app.php";
    try {
        return new PDO(
            "mysql:host=mysql2;dbname={$config['db']['name']};charset=utf8mb4",
            $config['db']['user'],
            $config['db']['pass'],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
    } catch (\Throwable $th) {
        throw $th;
        exit(1);
    }
}, 5);
