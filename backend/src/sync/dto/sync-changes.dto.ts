import { IsOptional, IsDateString, IsArray, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SyncChangesQueryDto {
  @ApiPropertyOptional({ description: 'Дата последней синхронизации (ISO 8601)', example: '2025-01-15T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  updated_since?: string;

  @ApiPropertyOptional({ description: 'Список сущностей для синхронизации', example: ['clients', 'vehicles', 'repairs'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  entities?: string[];
}

