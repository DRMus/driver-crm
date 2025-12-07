import { IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePartDto {
  @ApiProperty({ description: 'ID ремонта', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  repairId: string;

  @ApiProperty({ description: 'Наименование запчасти', example: 'Тормозные колодки' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Артикул/штрихкод', example: 'ABC123' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ description: 'Закупочная цена (руб.)', example: 1500.5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  purchasePrice?: number;

  @ApiPropertyOptional({ description: 'Продажная цена (руб.)', example: 2000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  salePrice?: number;

  @ApiPropertyOptional({ description: 'Количество', example: 2 })
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({ description: 'Поставщик', example: 'Автозапчасти ООО' })
  @IsString()
  @IsOptional()
  supplier?: string;
}

