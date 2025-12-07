import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  @Get('profile')
  @ApiOperation({ summary: 'Получить профиль пользователя' })
  @ApiResponse({ status: 200, description: 'Профиль пользователя' })
  getProfile() {
    // TODO: Реализовать получение профиля из БД или конфига
    return {
      name: 'Пользователь',
      email: 'user@example.com',
      phone: '+7 900 000 00 00',
    };
  }

  @Put('profile')
  @ApiOperation({ summary: 'Обновить профиль пользователя' })
  @ApiResponse({ status: 200, description: 'Профиль обновлен' })
  updateProfile(@Body() profile: { name?: string; email?: string; phone?: string }) {
    // TODO: Реализовать сохранение профиля в БД
    return {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
  }

  @Get('offline')
  @ApiOperation({ summary: 'Получить настройки офлайн-режима' })
  @ApiResponse({ status: 200, description: 'Настройки офлайн-режима' })
  getOfflineSettings() {
    return {
      enabled: true,
      syncInterval: 30000, // 30 секунд
      maxRetries: 3,
    };
  }
}

