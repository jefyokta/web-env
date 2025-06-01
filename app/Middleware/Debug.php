<?php

namespace App\Middleware;

use Oktaax\Http\Request;
use Oktaax\Http\Response;
use Swoole\Coroutine;

/**
 * 
 * Will Render Error but not always workin on syntax error
 * 
 */
class Debug
{


    public static function handle(Request $request, Response $response, $next)
    {
        try {
            $next($request, $response);
        } catch (\Throwable $th) {
            $file =  Coroutine::readFile($th->getFile());
            $lines = explode("\n", $file);
            $code = $lines[$th->getLine() - 1];

            ob_start();
            $message = $th->getMessage();
            $prevcode = $lines[$th->getLine() - 2] ?? '';
            $code = $code;
            $nextcode = $lines[$th->getLine()] ?? '';
            $error = $th;
            $req = $request;
            require __DIR__ . "/../../vendor/jefyokta/oktaax/src/Views/Error/index.php";
            $view =   ob_get_clean();
            $response->status(500)->end($view);
            throw $th;
        }
    }
};
