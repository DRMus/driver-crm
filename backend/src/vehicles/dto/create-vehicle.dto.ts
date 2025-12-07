import { IsString, IsOptional, IsUUID, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ description: 'UUID клиента', example: '5897e1b0-1234-5678-9abc-def012345678' })
  @IsUUID()
  clientId: string;

  @ApiProperty({ description: 'Марка автомобиля', example: 'Toyota' })
  @IsString()
  make: string;

  @ApiProperty({ description: 'Модель автомобиля', example: 'Camry' })
  @IsString()
  model: string;

  @ApiPropertyOptional({ description: 'Год выпуска', example: 2020, minimum: 1900 })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year?: number;

  @ApiPropertyOptional({ description: 'Государственный номер', example: 'А123БВ777' })
  @IsOptional()
  @IsString()
  plateNumber?: string;

  @ApiPropertyOptional({ description: 'VIN номер', example: '1HGBH41JXMN109186' })
  @IsOptional()
  @IsString()
  vin?: string;

  @ApiPropertyOptional({ description: 'Двигатель', example: '2.0L, 150 л.с.' })
  @IsOptional()
  @IsString()
  engine?: string;

  @ApiPropertyOptional({ description: 'Коробка передач', example: 'Автоматическая' })
  @IsOptional()
  @IsString()
  transmission?: string;

  @ApiPropertyOptional({ description: 'Цвет', example: 'Черный' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ description: 'Заметки', example: 'Дополнительная информация' })
  @IsOptional()
  @IsString()
  notes?: string;
}

