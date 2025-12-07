FROM node:20-alpine

# Устанавливаем PostgreSQL клиент для проверки готовности БД
RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Делаем entrypoint скрипт исполняемым
RUN chmod +x docker-entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm", "run", "start:prod"]

