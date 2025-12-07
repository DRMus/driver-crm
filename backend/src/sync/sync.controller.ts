import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SyncService, SyncResult } from './sync.service';
import { SyncChangesQueryDto, SyncBatchDto } from './dto';
import { ParseOptionalDatePipe } from '../common/pipes';

@ApiTags('sync')
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get('ping')
  @ApiOperation({ summary: 'Health-check: проверка доступности сервера' })
  @ApiResponse({ status: 200, description: 'Сервер доступен' })
  ping() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('changes')
  @ApiOperation({ summary: 'Получить изменения с сервера' })
  @ApiQuery({ name: 'updated_since', required: false, type: String })
  @ApiQuery({ name: 'entities', required: false, type: [String] })
  @ApiResponse({ status: 200, description: 'Список изменений' })
  async getChanges(
    @Query('updated_since', ParseOptionalDatePipe) updatedSince?: Date,
    @Query('entities') entities?: string,
  ) {
    const entitiesArray = entities ? entities.split(',') : undefined;
    const changes = await this.syncService.getChanges(updatedSince, entitiesArray);
    return changes;
  }

  @Post()
  @ApiOperation({ summary: 'Отправить батч изменений для синхронизации' })
  @ApiResponse({ status: 200, description: 'Результаты обработки изменений' })
  @ApiResponse({ status: 400, description: 'Неверный формат данных' })
  async sync(@Body() batch: SyncBatchDto): Promise<{
    results: SyncResult[];
    conflicts: SyncBatchDto['changes'];
    timestamp: string;
  }> {
    const result = await this.syncService.processBatch(batch);
    return {
      results: result.results,
      conflicts: result.conflicts,
      timestamp: new Date().toISOString(),
    };
  }
}

