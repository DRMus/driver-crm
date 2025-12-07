## Архитектура данных (PostgreSQL)

Ниже описана целевая модель данных CRM для учета ремонта автомобилей. База ориентирована на офлайн-синхронизацию, аудит и простые агрегаты для бухгалтерии.

### Общие принципы
- Идентификаторы — `uuid` (v4), генерируются на сервере.
- Денежные значения — в рублях как `numeric(10,2)` для хранения с двумя знаками после запятой.
- Даты/время — `timestamptz` (UTC).
- Для синхронизации — поля `created_at`, `updated_at` и необязательное `synced_at`.
- Логическое удаление (опционально) — поле `deleted_at timestamptz NULL` + частичные индексы.
- Строковые поля с поиском — `citext` для case-insensitive сравнения (расширение `citext`).
- Валидация VIN/госномера — уникальные индексы с учетом `deleted_at IS NULL`.

### ER-модель (словесно)
- `clients (1) — (N) vehicles`
- `vehicles (1) — (N) repairs`
- `repairs (1) — (N) repair_tasks`
- `repairs (1) — (N) parts`
- `calendar_events` — независимые события/заметки с напоминаниями

Итоги по ремонту (`labor_total`, `parts_total`, `grand_total`) денормализуются в `repairs` для быстрого чтения и отчетов.

---

### Схема БД (DDL, SQL)

Предполагается использование схемы `public`. Для `citext`:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";
```

#### Таблица: clients
```sql
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name citext NOT NULL,
  phone citext,
  email citext,
  address text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz NULL
);

-- Индексы и уникальность
CREATE INDEX idx_clients_full_name ON public.clients (full_name);
CREATE UNIQUE INDEX uq_clients_phone ON public.clients (phone) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uq_clients_email ON public.clients (email) WHERE email IS NOT NULL AND deleted_at IS NULL;
```

#### Таблица: vehicles
```sql
CREATE TABLE public.vehicles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON UPDATE CASCADE,
  make text NOT NULL,
  model text NOT NULL,
  year integer CHECK (year BETWEEN 1900 AND EXTRACT(YEAR FROM now())::int + 1),
  plate_number citext,
  vin citext,
  engine text,
  transmission text,
  color text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz NULL
);

-- Индексы и уникальность
CREATE INDEX idx_vehicles_client_id ON public.vehicles (client_id);
CREATE UNIQUE INDEX uq_vehicles_plate ON public.vehicles (plate_number) WHERE plate_number IS NOT NULL AND deleted_at IS NULL;
CREATE UNIQUE INDEX uq_vehicles_vin ON public.vehicles (vin) WHERE vin IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_vehicles_vin_trgm ON public.vehicles USING gin (vin gin_trgm_ops);
CREATE INDEX idx_vehicles_plate_trgm ON public.vehicles USING gin (plate_number gin_trgm_ops);
```

> Для индексов `gin_trgm_ops` потребуется расширение `pg_trgm`:
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

#### Таблица: repairs
```sql
CREATE TABLE public.repairs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id uuid NOT NULL REFERENCES public.vehicles(id) ON UPDATE CASCADE,
  reported_at date NOT NULL,
  name text,  -- название работы
  mileage integer CHECK (mileage >= 0),
  labor_total numeric(10,2) NOT NULL DEFAULT 0,  -- сумма работ в рублях (рассчитывается автоматически из repair_tasks)
  parts_total numeric(10,2) NOT NULL DEFAULT 0,  -- сумма запчастей (продажная) в рублях (рассчитывается автоматически из parts)
  grand_total numeric(10,2) NOT NULL DEFAULT 0,  -- labor_total + parts_total (рассчитывается автоматически)
  comments text,
  synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz NULL
);

CREATE INDEX idx_repairs_vehicle_id ON public.repairs (vehicle_id);
CREATE INDEX idx_repairs_reported_at ON public.repairs (reported_at);
```

Триггер для автообновления итогов можно повесить на изменения задач и запчастей (см. ниже).

#### Таблица: repair_tasks
```sql
CREATE TABLE public.repair_tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  repair_id uuid NOT NULL REFERENCES public.repairs(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),  -- цена за работу (рубли)
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_repair_tasks_repair_id ON public.repair_tasks (repair_id);
```

Примечание: `labor_total` в таблице `repairs` автоматически пересчитывается при изменении работ в `repair_tasks`.

#### Таблица: parts
```sql
CREATE TABLE public.parts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  repair_id uuid NOT NULL REFERENCES public.repairs(id) ON DELETE CASCADE,
  name text NOT NULL,
  sku citext,
  purchase_price numeric(10,2) NOT NULL DEFAULT 0 CHECK (purchase_price >= 0), -- закупочная, рубли
  sale_price numeric(10,2) NOT NULL DEFAULT 0 CHECK (sale_price >= 0),         -- продажная, рубли
  quantity numeric(10,2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
  supplier text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_parts_repair_id ON public.parts (repair_id);
CREATE INDEX idx_parts_sku ON public.parts (sku);
```

#### Таблица: calendar_events
```sql
CREATE TABLE public.calendar_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  event_date timestamptz NOT NULL,
  reminder_at timestamptz,  -- время напоминания (может быть раньше event_date)
  is_completed boolean NOT NULL DEFAULT false,
  color text,  -- цвет для визуализации в календаре (hex, например '#3b82f6')
  related_repair_id uuid REFERENCES public.repairs(id) ON DELETE SET NULL,  -- опциональная связь с ремонтом
  related_client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,  -- опциональная связь с клиентом
  synced_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz NULL
);

CREATE INDEX idx_calendar_events_event_date ON public.calendar_events (event_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_calendar_events_reminder_at ON public.calendar_events (reminder_at) WHERE reminder_at IS NOT NULL AND deleted_at IS NULL AND is_completed = false;
CREATE INDEX idx_calendar_events_related_repair ON public.calendar_events (related_repair_id) WHERE related_repair_id IS NOT NULL;
CREATE INDEX idx_calendar_events_related_client ON public.calendar_events (related_client_id) WHERE related_client_id IS NOT NULL;
```

#### Таблица: push_subscriptions
Хранение подписок на Web Push уведомления для отправки напоминаний:
```sql
CREATE TABLE public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  endpoint text NOT NULL UNIQUE,  -- URL эндпоинта push-сервиса
  p256dh text NOT NULL,  -- ключ для шифрования
  auth text NOT NULL,  -- ключ аутентификации
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_push_subscriptions_endpoint ON public.push_subscriptions (endpoint);
```

---

### Денормализация итогов и триггеры
Для согласованности итогов в `repairs` создаём функции-пересчёты:
```sql
CREATE OR REPLACE FUNCTION public.recalc_repair_totals(p_repair_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.repairs r
  SET labor_total = COALESCE((
        SELECT SUM(price) FROM public.repair_tasks t WHERE t.repair_id = p_repair_id
      ), 0),
      parts_total = COALESCE((
        SELECT SUM(sale_price * quantity) FROM public.parts p WHERE p.repair_id = p_repair_id
      ), 0),
      grand_total = labor_total + parts_total,
      updated_at = now()
  WHERE r.id = p_repair_id;
END;
$$ LANGUAGE plpgsql;
```

Триггеры на `repair_tasks` и `parts`:
```sql
CREATE OR REPLACE FUNCTION public.on_mutation_recalc()
RETURNS trigger AS $$
DECLARE v_repair_id uuid;
BEGIN
  IF TG_TABLE_NAME = 'repair_tasks' THEN
    v_repair_id := COALESCE(NEW.repair_id, OLD.repair_id);
  ELSE
    v_repair_id := COALESCE(NEW.repair_id, OLD.repair_id);
  END IF;
  PERFORM public.recalc_repair_totals(v_repair_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tasks_recalc
AFTER INSERT OR UPDATE OR DELETE ON public.repair_tasks
FOR EACH ROW EXECUTE FUNCTION public.on_mutation_recalc();

CREATE TRIGGER trg_parts_recalc
AFTER INSERT OR UPDATE OR DELETE ON public.parts
FOR EACH ROW EXECUTE FUNCTION public.on_mutation_recalc();
```

---

### Аудит изменений (опционально)
Минимальный аудит для `repairs`:
```sql
CREATE TABLE public.repairs_history (
  id bigserial PRIMARY KEY,
  repair_id uuid NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now(),
  action text NOT NULL, -- INSERT/UPDATE/DELETE
  old_record jsonb,
  new_record jsonb
);

CREATE OR REPLACE FUNCTION public.audit_repairs()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.repairs_history (repair_id, action, new_record)
    VALUES (NEW.id, TG_OP, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.repairs_history (repair_id, action, old_record, new_record)
    VALUES (NEW.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSE
    INSERT INTO public.repairs_history (repair_id, action, old_record)
    VALUES (OLD.id, TG_OP, to_jsonb(OLD));
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_repairs_audit
AFTER INSERT OR UPDATE OR DELETE ON public.repairs
FOR EACH ROW EXECUTE FUNCTION public.audit_repairs();
```

---

### Отчетность
Агрегаты строятся запросами по `repairs`, `repair_tasks`, `parts`. Пример расчёта выручки/себестоимости/маржи за период:
```sql
SELECT
  date_trunc($1, r.reported_at)::date AS period_start,
  SUM(r.labor_total) AS labor_revenue,
  SUM(r.parts_total) AS parts_revenue,
  SUM((
    SELECT COALESCE(SUM(p.purchase_price * p.quantity), 0)
    FROM public.parts p WHERE p.repair_id = r.id
  )) AS parts_cost,
  SUM(r.grand_total) - SUM((
    SELECT COALESCE(SUM(p.purchase_price * p.quantity), 0)
    FROM public.parts p WHERE p.repair_id = r.id
  )) AS margin
FROM public.repairs r
WHERE r.reported_at BETWEEN $2 AND $3
  AND r.deleted_at IS NULL
GROUP BY 1
ORDER BY 1;
-- $1 = 'day' | 'week' | 'month'
```

---

### Политика синхронизации
- Клиент запрашивает изменения через `updated_since` для таблиц `clients`, `vehicles`, `repairs`, `repair_tasks`, `parts`, `calendar_events`.
- Вставки/обновления/удаления применяются по UUID. Конфликты разрешаются по стратегии «последняя запись по `updated_at` выигрывает» с сохранением истории.
- Рекомендуется возвращать вместе с данными `server_time` для корректной установки `updated_since`.
- Таблица `push_subscriptions` синхронизируется отдельно и не участвует в общем потоке синхронизации данных.

---

### Резервное копирование и восстановление
- Ежедневные dump’ы (`pg_dump`) базы.
- Для однопользовательского сценария можно предусмотреть экспорт/импорт JSON по всем сущностям, подписанный и зашифрованный (напр., `age`).

---

### Замечания по производительности
- Индексы по внешним ключам обязательны.
- Триграммные индексы (`pg_trgm`) ускоряют поиск по `vin` и `plate_number`.
- Частичные индексы с `WHERE deleted_at IS NULL` уменьшают размер и ускоряют поиск по активным данным.

Этот документ конкретизирует структуру БД и служит основой для миграций и реализации моделей в ORM (TypeORM/Prisma).

