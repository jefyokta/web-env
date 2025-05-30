FROM php:8.3-cli

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    curl \
    libssl-dev \
    libcurl4-openssl-dev \
    libpng-dev \
    libzip-dev \
    bun \
    && docker-php-ext-install pdo pdo_mysql zip bcmath sockets \
    && pecl install swoole && docker-php-ext-enable swoole \
    && apt-get clean && rm -rf /var/lib/apt/lists/*