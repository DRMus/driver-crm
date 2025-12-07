#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."

# Функция для проверки готовности PostgreSQL
wait_for_postgres() {
  until PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -U "${DB_USERNAME}" -d "${DB_DATABASE}" -c '\q' 2>/dev/null; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 1
  done
  echo "PostgreSQL is up - executing command"
}

# Ждем готовности PostgreSQL
wait_for_postgres

# Применяем миграции
echo "Running database migrations..."
npm run migration:run:prod

# Запускаем приложение
echo "Starting application..."
exec "$@"
