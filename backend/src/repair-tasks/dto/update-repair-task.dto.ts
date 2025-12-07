import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRepairTaskDto {
  @ApiPropertyOptional({ description: 'Название работы' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Сумма (руб.)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;
}

