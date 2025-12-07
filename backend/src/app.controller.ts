import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Информация о сервисе' })
  @ApiResponse({ status: 200, description: 'Информация о сервисе' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('ping')
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Сервис доступен' })
  ping() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}

