import { IsUUID, IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRepairDto {
  @ApiPropertyOptional({ description: 'ID автомобиля', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  vehicleId?: string;

  @ApiPropertyOptional({ description: 'Дата обращения/ремонта', example: '2025-02-10' })
  @IsOptional()
  @IsDateString()
  reportedAt?: string;

  @ApiPropertyOptional({ description: 'Название работы', example: 'Замена масла и фильтров' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Пробег на момент приема', example: 50000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  mileage?: number;

  @ApiPropertyOptional({ description: 'Сумма работ в копейках', example: 500000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  laborTotal?: number;

  @ApiPropertyOptional({ description: 'Сумма запчастей в копейках', example: 300000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  partsTotal?: number;

  @ApiPropertyOptional({ description: 'Общий итог в копейках', example: 800000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  grandTotal?: number;

  @ApiPropertyOptional({ description: 'Комментарии', example: 'Требуется замена масла' })
  @IsOptional()
  @IsString()
  comments?: string;
}

