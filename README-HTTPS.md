# Настройка локального HTTPS

Для работы push-уведомлений требуется HTTPS (кроме localhost). Эта инструкция поможет настроить локальный HTTPS для разработки.

## Генерация SSL сертификатов

### Windows (PowerShell)

```powershell
# Убедитесь, что OpenSSL установлен
# Если нет, установите через Chocolatey: choco install openssl

# Запустите скрипт
.\scripts\generate-certificates.ps1
```

### Linux/macOS

```bash
# Убедитесь, что OpenSSL установлен
# Если нет: sudo apt-get install openssl (Ubuntu/Debian) или brew install openssl (macOS)

# Сделайте скрипт исполняемым
chmod +x scripts/generate-certificates.sh

# Запустите скрипт
./scripts/generate-certificates.sh
```

### Ручная генерация

Если скрипты не работают, выполните команды вручную:

```bash
# Создайте директорию для сертификатов
mkdir -p certs

# Генерируем приватный ключ
openssl genrsa -out certs/localhost.key 2048

# Создаем конфигурационный файл
cat > certs/localhost.conf <<EOF
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
CN = localhost

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = *.localhost
IP.1 = 127.0.0.1
IP.2 = ::1
EOF

# Генерируем самоподписанный сертификат
openssl req -new -x509 -key certs/localhost.key -out certs/localhost.crt -days 365 -config certs/localhost.conf -extensions v3_req
```

## Результат

После выполнения скрипта в папке `certs/` должны появиться файлы:
- `localhost.key` - приватный ключ
- `localhost.crt` - сертификат

## Использование

После генерации сертификатов:

1. **Бэкенд** автоматически обнаружит сертификаты и запустится на HTTPS (https://localhost:4000)
2. **Фронтенд** автоматически обнаружит сертификаты и запустится на HTTPS (https://localhost:3000)

Если сертификаты не найдены, приложения будут работать на HTTP как обычно.

## Важно

⚠️ **Самоподписанные сертификаты** - браузеры будут показывать предупреждение о безопасности. Это нормально для локальной разработки.

Для принятия сертификата в браузере:
1. Откройте https://localhost:3000 или https://localhost:4000
2. Нажмите "Дополнительно" / "Advanced"
3. Нажмите "Перейти на сайт" / "Proceed to localhost"

## Переменные окружения

Можно настроить URL через переменные окружения:

```bash
# .env в корне проекта
FRONTEND_URL=https://localhost:3000
VITE_API_URL=https://localhost:4000
```

