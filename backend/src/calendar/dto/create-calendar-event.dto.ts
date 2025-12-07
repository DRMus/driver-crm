import { IsString, IsDateString, IsBoolean, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCalendarEventDto {
  @ApiProperty({ description: 'Заголовок события', example: 'Позвонить клиенту Иванову' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ description: 'Описание события', example: 'Уточнить время приезда для ТО' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Дата и время события (ISO 8601)', example: '2025-03-15T10:00:00Z' })
  @IsDateString()
  eventDate: string;

  @ApiPropertyOptional({ description: 'Дата и время напоминания (ISO 8601)', example: '2025-03-15T09:30:00Z' })
  @IsOptional()
  @IsDateString()
  reminderAt?: string;

  @ApiPropertyOptional({ description: 'Статус выполнения', example: false, default: false })
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

