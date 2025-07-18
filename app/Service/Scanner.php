<?php

namespace App\Service;

use Swoole\Coroutine;
use Swoole\Coroutine\WaitGroup;
use Swoole\Coroutine\Channel;
use Swoole\Coroutine\Http\Client;

use function Swoole\Coroutine\run;

class Scanner
{
    public function find()
    {
        run(function () {
            $subnet = $this->getSubnet();
            echo "🔍 Scanning LAN for ESP devices in subnet $subnet\n";
            $activeHosts = $this->scanSubnet($subnet);

            echo "✅ Found (" . count($activeHosts) . ") active host(s):\n";
            foreach ($activeHosts as $ip) {
                echo " - $ip\n";

                if ($this->isEsp($ip)) {
                    echo " <-";

                    Coroutine::writeFile(__DIR__ . "/../../storage/esp", $ip);
                };
                echo "\n";
            }
        });
    }

    protected function getLocalIP(): string
    {
        $interfaces = swoole_get_local_ip();
        return $interfaces["en0"] ?? $interfaces["eth0"] ?? "0.0.0.0";
    }

    protected function getSubnet(): string
    {
        $ip = $this->getLocalIP();
        return implode('.', array_slice(explode('.', $ip), 0, 3)) . '.';
    }

    /**
     * Scan all hosts on subnet by ping and return active IPs
     * @param string $subnet e.g. '192.168.129.'
     * @return array<string> active IPs
     */
    protected function scanSubnet(string $subnet): array
    {
        $wg = new WaitGroup();
        $channel = new Channel(256);

        for ($i = 1; $i <= 254; $i++) {
            $wg->add();
            Coroutine::create(function () use ($subnet, $i, $channel, $wg) {
                $ip = $subnet . $i;
                if ($this->pingHost($ip)) {
                    $channel->push($ip);
                }
                $wg->done();
            });
        }

        $wg->wait();
        $channel->close();

        $activeHosts = [];
        while (!$channel->isEmpty()) {
            $activeHosts[] = $channel->pop();
        }

        return $activeHosts;
    }

    /**
     * Ping host, return true if reachable
     */
    protected function pingHost(string $ip): bool
    {
        $output = shell_exec("ping -c 1 -W 1 $ip 2>&1");
        if (@preg_match('/(\d+) packets transmitted, (\d+) packets received/', $output, $matches)) {
            $received = (int)$matches[2];
            return $received > 0;
        }
        return false;
    }

    protected function isEsp(string $ip): bool
    {
        $host = $ip;

        $client = new Client($host, 80);
        $form = http_build_query([
            "host" => swoole_get_local_ip(),
            "port" => $_ENV["APP_PORT"]
        ]);

        $client->setHeaders([
            'Content-Type' => 'application/x-www-form-urlencoded',
            'Content-Length' => strlen($form)
        ]);
        $ret =  $client->post("/ws-config", $form);

        if ($ret && $client->statusCode === 200) {
            $client->close();
            return true;
        }
        echo is_scalar($client->getBody()) ? $client->getBody() : json_encode($client->getBody());

        $client->close();
        return false;
    }
}
