<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Realtime Enviorment Monitoring</title>

    <?php
    $manifestPath = __DIR__ . "/../../public/build/.vite/manifest.json";
    if (file_exists($manifestPath)) {
        $manifest = json_decode(file_get_contents($manifestPath), true);
        $entry = $manifest["resources/js/main.tsx"] ?? null;
        if ($entry) {
            if (!empty($entry['css'])) {
                foreach ($entry['css'] as $css) {
                    echo '<link rel="stylesheet" href="/build/' . $css . '">' . PHP_EOL;
                }
            }
        }
    } ?>
    <?php if (!isset($entry)) : ?>
        <script type="module" src="http://localhost:5173/@vite/client"></script>
    <?php endif ?>
</head>

<body>
    <div id="app" data-page='<?= $page ?>'></div>

    <?php if (!isset($entry)) : ?>
        <script type="module" src="http://localhost:5173/resources/js/main.tsx"></script>
    <?php else : ?>
        <script type="module" src="/build/<?= $entry['file'] ?>"></script>
    <?php endif; ?>

</body>

</html>