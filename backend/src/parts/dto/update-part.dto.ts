import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePartDto {
  @ApiPropertyOptional({ description: 'Наименование запчасти' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Артикул/штрихкод' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ description: 'Закупочная цена (руб.)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  purchasePrice?: number;

  @ApiPropertyOptional({ description: 'Продажная цена (руб.)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  salePrice?: number;

  @ApiPropertyOptional({ description: 'Количество' })
  @IsNumber()
  @Min(0.01)
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({ description: 'Поставщик' })
  @IsString()
  @IsOptional()
  supplier?: string;
}

