## REST API: CRM учета ремонта

Документ описывает REST эндпоинты будущего приложения. Все ответы — JSON. Версия API предполагается `v1`, базовый URL `https://example.com/api`.

### Общие правила
- Заголовки: `Content-Type: application/json`.
- Идентификаторы — UUID v4.
- Даты в ISO 8601 (UTC). Денежные величины в базовой валюте сервиса (например, RUB) и хранятся в рублях с двумя знаками после запятой.
- Параметр `updated_since` используется для инкрементальной синхронизации — принимает дату/время и возвращает только записи, изменённые позже.
- Контроль доступности сети реализован через браузерные события и служебный эндпоинт `/ping`, который фронтенд периодически вызывает для health-check; при ошибках UI переключается в офлайн-режим и приостанавливает фоновые запросы.

---

### Клиенты (`/clients`)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/clients` | Список клиентов с фильтрами `search`, `limit`, `offset`, `updated_since`. |
| GET | `/clients/{id}` | Детали клиента + связанные автомобили. |
| POST | `/clients` | Создание клиента. |
| PUT | `/clients/{id}` | Полное обновление. |
| PATCH | `/clients/{id}` | Частичное обновление. |
| DELETE | `/clients/{id}` | Логическое удаление (soft delete). |

**Пример POST**  
Запрос:
```json
{
  "fullName": "Иван Петров",
  "phone": "+7 900 000 00 00",
  "email": "client@example.com",
  "address": "г. Казань, ул. Лесная 5",
  "notes": "любые пожелания"
}
```
Ответ `201`:
```json
{
  "id": "5897e1b0-...",
  "createdAt": "2025-02-10T08:15:00Z"
}
```

---

### Автомобили (`/vehicles`)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/vehicles` | Поиск по VIN, госномеру, клиенту (`clientId`), `updated_since`. |
| GET | `/vehicles/{id}` | Подробности + история ремонтов. |
| POST | `/vehicles` | Создание (обязателен `clientId`). |
| PUT/PATCH | `/vehicles/{id}` | Обновление. |
| DELETE | `/vehicles/{id}` | Логическое удаление. |

Поля: `make`, `model`, `year`, `vin`, `plateNumber`, `engine`, `transmission`, `color`, `notes`.

---

### Ремонты (`/repairs`)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/repairs` | Фильтры: `vehicleId`, `dateFrom`, `dateTo`, `updated_since`. |
| GET | `/repairs/{id}` | Детали ремонта, задачи, запчасти, суммы. |
| POST | `/repairs` | Создание заказа-наряда. |
| PUT/PATCH | `/repairs/{id}` | Обновление статуса, пробега, комментариев. |
| DELETE | `/repairs/{id}` | Логическое удаление. |

**Структура ремонта**
```json
{
  "vehicleId": "f8f7...",
  "reportedAt": "2025-03-01",
  "mileage": 120000,
  "name": "Плановое ТО",
  "tasks": [
    { "name": "Замена масла", "laborHours": 1, "laborRate": 1500, "price": 1500 }
  ],
  "parts": [
    { "name": "Фильтр масляный", "sku": "FL-001", "purchasePrice": 400, "salePrice": 650, "quantity": 1 }
  ],
  "comments": "Клиент просил проверить тормоза"
}
```

---

### Задачи ремонта (`/repair-tasks`)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/repair-tasks` | Параметры `repairId`. |
| GET | `/repair-tasks/{id}` | Детали работы. |
| POST | `/repair-tasks` | Добавление работы к ремонту. |
| PATCH | `/repair-tasks/{id}` | Обновление работы. |
| DELETE | `/repair-tasks/{id}` | Удаление. |

**Пример POST `/repair-tasks`**  
Запрос:
```json
{
  "repairId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Замена масла",
  "price": 1500.00
}
```

Примечание: При создании, обновлении или удалении работы автоматически пересчитывается `laborTotal` и `grandTotal` в связанном ремонте.

---

### Работы (`/repair-tasks`)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/repair-tasks` | Фильтры `repairId`. |
| POST | `/repair-tasks` | Добавление работы. |
| GET | `/repair-tasks/{id}` | Детали работы. |
| PATCH | `/repair-tasks/{id}` | Обновление работы. |
| DELETE | `/repair-tasks/{id}` | Удаление. |

**Пример POST `/repair-tasks`**  
Запрос:
```json
{
  "repairId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Замена масла",
  "price": 1500.00
}
```

---

### Запчасти (`/parts`)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/parts` | Фильтры `repairId`, `search`, `updated_since`. |
| POST | `/parts` | Добавление позиции. |
| PATCH | `/parts/{id}` | Обновление цены, количества. |
| DELETE | `/parts/{id}` | Удаление. |

---

### Календарь (`/calendar`)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/calendar/events` | Список событий с фильтрами `dateFrom`, `dateTo`, `isCompleted`, `relatedRepairId`, `relatedClientId`, `updated_since`. |
| GET | `/calendar/events/{id}` | Детали события. |
| POST | `/calendar/events` | Создание события/заметки. |
| PUT | `/calendar/events/{id}` | Полное обновление события. |
| PATCH | `/calendar/events/{id}` | Частичное обновление (например, отметка как выполненное). |
| DELETE | `/calendar/events/{id}` | Логическое удаление. |
| GET | `/calendar/upcoming` | Ближайшие события с напоминаниями (параметры `limit`, `days`). |

**Пример POST**  
Запрос:
```json
{
  "title": "Позвонить клиенту Иванову",
  "description": "Уточнить время приезда для ТО",
  "eventDate": "2025-03-15T10:00:00Z",
  "reminderAt": "2025-03-15T09:30:00Z",
  "color": "#3b82f6",
  "relatedClientId": "5897e1b0-...",
  "relatedRepairId": null
}
```

Ответ `201`:
```json
{
  "id": "a1b2c3d4-...",
  "createdAt": "2025-03-10T08:15:00Z"
}
```

**Пример GET `/calendar/upcoming?days=7&limit=10`**  
Ответ `200`:
```json
{
  "events": [
    {
      "id": "a1b2c3d4-...",
      "title": "Позвонить клиенту Иванову",
      "eventDate": "2025-03-15T10:00:00Z",
      "reminderAt": "2025-03-15T09:30:00Z",
      "isCompleted": false,
      "color": "#3b82f6"
    }
  ],
  "count": 1
}
```

---

### Push-уведомления (`/notifications`)

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/notifications/subscribe` | Регистрация подписки на Web Push уведомления. |
| DELETE | `/notifications/subscribe/{id}` | Отмена подписки. |
| GET | `/notifications/subscriptions` | Список активных подписок. |
| POST | `/notifications/test` | Отправка тестового уведомления (для проверки). |

**Пример POST `/notifications/subscribe`**  
Запрос:
```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "BGx...",
    "auth": "xYz..."
  }
}
```

Ответ `201`:
```json
{
  "id": "sub-123",
  "createdAt": "2025-03-10T08:15:00Z"
}
```

**Примечание**: Сервер автоматически отправляет push-уведомления при наступлении времени напоминания (`reminderAt`) для событий календаря, если подписка активна. Уведомления отправляются через фоновый процесс (cron job или очередь задач).

---

### Синхронизация (`/sync`)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/ping` | Health-check: минимальный отклик для проверки доступности сервера. |
| POST | `/sync` | Принимает пакет локальных изменений — массив операций (create/update/delete) с временными ID. Возвращает подтверждения, окончательные ID и список конфликтов. |
| GET | `/sync/changes` | Выгрузка изменений с сервера (использует `updated_since`). |

**Формат операции**
```json
{
  "entity": "repairs",
  "operation": "update",
  "tempId": "local-123",
  "payload": { ... },
  "updatedAt": "2025-03-05T10:00:00Z"
}
```

Поддерживаемые сущности для синхронизации: `clients`, `vehicles`, `repairs`, `repair-tasks`, `parts`, `calendar-events`.

Конфликты возвращаются в виде:
```json
{
  "tempId": "local-123",
  "serverRecord": { ... },
  "clientRecord": { ... },
  "message": "Server record is newer"
}
```

---

### Отчёты (`/reports`)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/reports/summary` | Параметры `from`, `to`, `groupBy` (`day`, `week`, `month`). Возвращает массив объектов `{ periodStart, periodEnd, revenue, partsCost, laborRevenue, margin }`. |
| GET | `/reports/daily` | Быстрый отчёт за указанный день (`date`). |
| GET | `/reports/export` | Генерирует CSV/PDF (параметр `format`). |

---

### Настройки механика (`/settings`)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/settings/profile` | Возвращает персональные параметры (имя мастера, подпись в актах, ставки). |
| PUT | `/settings/profile` | Обновление настроек. |
| GET | `/settings/offline` | Состояние хранилища (лимиты, шифрование, последняя синхронизация). |

---

### Ответы об ошибках
- Структура:
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Поле phone обязательно"
}
```
- `409 Conflict` — при синхронизационных конфликтах (ссылка на `/sync/conflicts/{id}` если нужно сохранить).

---

### Версионирование и будущее расширение
- Новые версии публикуются как `/api/v2/...` с сохранением обратной совместимости v1 до миграции данных.
- Для интеграций (например, экспорт в бухгалтерию) планируется отдельный раздел `/integrations/...`.

Этот документ служит основой для реализации REST API, отражая ключевые ресурсы, параметры и форматы ответов PWA-CRM для механика.

