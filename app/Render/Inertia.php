<?php

namespace App\Render;

use Oktaax\Http\Request;
use Oktaax\Http\Response;

class Inertia
{
    /**
     * Render Inertia response
     * 
     * @param Request $request
     * @param Response $response
     * @param array $data Associative array with keys:
     *                    - component: string component name
     *                    - props: array of props for component
     * 
     * @return void
     */
    public static function render($component, array $data = [])
    {
        $request = Request::getInstance();
        $response =  Response::getInstance();
        $props = $data['props'] ?? [];
        if (!$component) {
            throw new \InvalidArgumentException("Inertia render requires 'component' key");
        }


        $isInertia = !empty($request->header['x-inertia'] ?? null);
        if ($isInertia) {
            $response->header('Content-Type', 'application/json');
            $response->header('X-Inertia', true);
            $payload = [
                'component' => $component,
                'props' => $props,
                'url' => $request->server['request_uri'],
                'version' => null
            ];
            $response->end(json_encode($payload));
        } else {
            $page = json_encode([
                'component' => $component,
                'props' => $props,
                'url' => $request->server['request_uri'],
                'version' => null
            ]);
            $response->render('app', ['page' => $page]);
        }
    }
}
