# Настройка базы данных

## Быстрый старт

### Вариант 1: Автоматическое создание (рекомендуется)

Запустите скрипт для автоматического создания базы данных:

```bash
npm run db:create
```

Этот скрипт:
- Подключится к PostgreSQL
- Проверит существование базы данных `driver_crm`
- Создаст базу данных, если её нет

### Вариант 2: Ручное создание через psql

1. Подключитесь к PostgreSQL:
```bash
psql -U postgres
```

2. Создайте базу данных:
```sql
CREATE DATABASE driver_crm;
```

3. Подключитесь к созданной базе:
```sql
\c driver_crm;
```

4. Создайте необходимые расширения:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

### Вариант 3: Использование SQL скрипта

Выполните SQL скрипт:
```bash
psql -U postgres -f scripts/create-database.sql
```

## Проверка подключения

После создания базы данных убедитесь, что переменные окружения в `.env` файле настроены правильно:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=driver_crm
```

Затем запустите приложение:
```bash
npm run start:dev
```

## Troubleshooting

### Ошибка: "база данных не существует"
- Убедитесь, что PostgreSQL запущен
- Проверьте, что база данных создана: `psql -U postgres -l`
- Запустите `npm run db:create`

### Ошибка: "отказано в доступе"
- Проверьте правильность username и password в `.env`
- Убедитесь, что пользователь PostgreSQL имеет права на создание баз данных

### Ошибка подключения
- Проверьте, что PostgreSQL запущен: `pg_isready`
- Проверьте порт (по умолчанию 5432)
- Убедитесь, что firewall не блокирует подключение

