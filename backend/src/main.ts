import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  // Настройка HTTPS (если сертификаты доступны)
  const httpsOptions = getHttpsOptions();
  
  const app = httpsOptions
    ? await NestFactory.create(AppModule, { httpsOptions })
    : await NestFactory.create(AppModule);

  // Глобальная валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  const frontendUrl = process.env.FRONTEND_URL || "*";
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  // Префикс для всех роутов
  app.setGlobalPrefix('api');

  // Swagger документация
  const config = new DocumentBuilder()
    .setTitle('Driver CRM API')
    .setDescription('API для CRM системы учета ремонта автомобилей')
    .setVersion('1.0')
    .addTag('clients', 'Управление клиентами')
    .addTag('vehicles', 'Управление автомобилями')
    .addTag('repairs', 'Управление ремонтами')
    .addTag('calendar', 'Календарь и события')
    .addTag('reports', 'Отчеты')
    .addTag('sync', 'Синхронизация')
    .addTag('notifications', 'Push-уведомления')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 4000;
  const protocol = httpsOptions ? 'https' : 'http';
  await app.listen(port);
  console.log(`Application is running on: ${protocol}://localhost:${port}`);
  console.log(`Swagger documentation: ${protocol}://localhost:${port}/api/docs`);
}

function getHttpsOptions() {
  const keyPath = path.join(__dirname, '../../certs/localhost.key');
  const certPath = path.join(__dirname, '../../certs/localhost.crt');

  // Проверяем наличие сертификатов
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  }

  return null;
}

bootstrap();

