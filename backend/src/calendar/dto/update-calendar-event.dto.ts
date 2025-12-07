import { IsString, IsDateString, IsBoolean, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCalendarEventDto {
  @ApiPropertyOptional({ description: 'Заголовок события', example: 'Позвонить клиенту Иванову' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ description: 'Описание события', example: 'Уточнить время приезда для ТО' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Дата и время события (ISO 8601)', example: '2025-03-15T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  eventDate?: string;

  @ApiPropertyOptional({ description: 'Дата и время напоминания (ISO 8601)', example: '2025-03-15T09:30:00Z' })
  @IsOptional()
  @IsDateString()
  reminderAt?: string;

  @ApiPropertyOptional({ description: 'Статус выполнения', example: false })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiPropertyOptional({ description: 'Цвет события (hex)', example: '#3b82f6' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ description: 'ID связанного ремонта', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  relatedRepairId?: string;

  @ApiPropertyOptional({ description: 'ID связанного клиента', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  relatedClientId?: string;
}

