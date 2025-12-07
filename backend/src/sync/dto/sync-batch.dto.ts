import { IsArray, IsString, ValidateNested, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SyncOperation {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export class SyncItemDto {
  @ApiProperty({ description: 'Временный ID клиента (для новых записей)', example: 'temp-123' })
  @IsOptional()
  @IsString()
  tempId?: string;

  @ApiProperty({ description: 'ID записи на сервере (для существующих)', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'Тип операции', enum: SyncOperation, example: SyncOperation.CREATE })
  @IsEnum(SyncOperation)
  operation: SyncOperation;

  @ApiProperty({ description: 'Тип сущности', example: 'client' })
  @IsString()
  entity: string;

  @ApiProperty({ description: 'Данные сущности' })
  data: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Версия записи (updatedAt)', example: '2025-01-15T10:00:00Z' })
  @IsOptional()
  @IsString()
  version?: string;
}

export class SyncBatchDto {
  @ApiProperty({ description: 'Список изменений для синхронизации', type: [SyncItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncItemDto)
  changes: SyncItemDto[];
}

