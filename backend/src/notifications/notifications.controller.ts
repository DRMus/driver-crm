import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreatePushSubscriptionDto } from './dto';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('public-key')
  @ApiOperation({ summary: 'Получить публичный VAPID ключ' })
  @ApiResponse({ status: 200, description: 'Публичный ключ' })
  getPublicKey() {
    const publicKey = this.notificationsService.getPublicKey();
    if (!publicKey) {
      return { error: 'VAPID ключи не настроены' };
    }
    return { publicKey };
  }

  @Post('subscribe')
  @ApiOperation({ summary: 'Подписаться на push-уведомления' })
  @ApiResponse({ status: 201, description: 'Подписка создана' })
  @HttpCode(HttpStatus.CREATED)
  async subscribe(@Body() dto: CreatePushSubscriptionDto) {
    return await this.notificationsService.createSubscription(dto);
  }

  @Delete('unsubscribe/:endpoint')
  @ApiOperation({ summary: 'Отписаться от push-уведомлений' })
  @ApiResponse({ status: 200, description: 'Подписка удалена' })
  @HttpCode(HttpStatus.OK)
  async unsubscribe(@Param('endpoint') endpoint: string) {
    await this.notificationsService.deleteSubscription(decodeURIComponent(endpoint));
    return { message: 'Подписка удалена' };
  }
}

