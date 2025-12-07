# Инструкция по запуску проекта

## Требования

- Node.js 20+
- Docker и Docker Compose (опционально, для запуска через Docker)
- PostgreSQL 15+ (если запускаете без Docker)

## Быстрый старт

### Вариант 1: Запуск через Docker Compose (рекомендуется)

1. Клонируйте репозиторий
2. Скопируйте `.env.example` в `.env` и при необходимости отредактируйте
3. Запустите все сервисы:
```bash
docker-compose up -d
```

Сервисы будут доступны:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- PostgreSQL: localhost:5432

### Вариант 2: Локальный запуск

#### Backend

1. Перейдите в папку `backend`:
```bash
cd backend
```

2. Установите зависимости:
```bash
npm install
```

3. Убедитесь, что PostgreSQL запущен и создана база данных `driver_crm`

4. Создайте файл `.env` в папке `backend`:
```env
NODE_ENV=development
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=driver_crm
FRONTEND_URL=http://localhost:3000
```

5. Запустите миграции (когда они будут созданы):
```bash
npm run migration:run
```

6. Запустите сервер:
```bash
npm run start:dev
```

Backend будет доступен на http://localhost:4000

#### Frontend

1. Перейдите в папку `frontend`:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в папке `frontend`:
```env
VITE_API_URL=http://localhost:4000/api
```

4. Запустите dev-сервер:
```bash
npm run dev
```

Frontend будет доступен на http://localhost:3000

## Структура проекта

```
driver-crm/
├── backend/          # NestJS приложение
│   ├── src/
│   │   ├── clients/  # Модуль клиентов
│   │   ├── vehicles/ # Модуль автомобилей
│   │   └── ...
│   └── package.json
├── frontend/         # React приложение (FSD архитектура)
│   ├── src/
│   │   ├── app/      # Инициализация приложения
│   │   ├── pages/    # Страницы
│   │   ├── widgets/  # Крупные блоки
│   │   ├── features/ # Бизнес-логика
│   │   ├── entities/ # Бизнес-сущности
│   │   └── shared/   # Переиспользуемые компоненты
│   └── package.json
└── docker-compose.yml
```

## Разработка

### Backend

- `npm run start:dev` - запуск в режиме разработки с hot-reload
- `npm run build` - сборка проекта
- `npm run test` - запуск тестов
- `npm run migration:generate` - генерация миграции
- `npm run migration:run` - применение миграций

### Frontend

- `npm run dev` - запуск dev-сервера
- `npm run build` - сборка для production
- `npm run preview` - предпросмотр production сборки
- `npm run lint` - проверка кода линтером

## Использованные технологии

### Backend
- NestJS
- TypeORM
- PostgreSQL
- Docker

### Frontend
- React 18
- TypeScript
- Vite
- Material-UI (MUI)
- React Query (TanStack Query)
- Axios
- React Router
- Zustand
- FSD (Feature-Sliced Design)

## Следующие шаги

1. Создать миграции для базы данных
2. Реализовать модули Clients и Vehicles
3. Создать API эндпоинты
4. Реализовать фронтенд экраны
5. Настроить офлайн-синхронизацию с IndexedDB
6. Добавить PWA функционал
7. Реализовать календарь с push-уведомлениями

