<?php

use Swoole\ConnectionPool;

return new ConnectionPool(function () {
    $config = require __DIR__ . "/../config/app.php";
    try {
        return new PDO(
            "mysql:host={$config['db']['host']};dbname={$config['db']['name']};charset=utf8mb4",
            "root",
            "",
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
