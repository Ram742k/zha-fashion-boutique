#!/bin/bash

# Fallback for APP_KEY if not set
if [ -z "$APP_KEY" ]; then
    echo "Generating APP_KEY..."
    php artisan key:generate --force
fi

# Ensure storage directories exist
mkdir -p storage/framework/{sessions,views,cache}
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Run migrations if DB is connected
if [ "$DB_CONNECTION" = "sqlite" ] && [ ! -f "$DB_DATABASE" ] && [[ "$DB_DATABASE" == *.sqlite ]]; then
    mkdir -p "$(dirname "$DB_DATABASE")"
    touch "$DB_DATABASE"
    chown -R www-data:www-data "$(dirname "$DB_DATABASE")"
fi

echo "Running migrations..."
php artisan migrate --force --no-interaction

exec "$@"
