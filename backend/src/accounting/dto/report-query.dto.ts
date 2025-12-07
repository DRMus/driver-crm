import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ReportGroupBy {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export class ReportQueryDto {
  @ApiPropertyOptional({ description: 'Дата начала периода (ISO 8601)', example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ description: 'Дата окончания периода (ISO 8601)', example: '2025-01-31' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({ 
    description: 'Группировка данных', 
    enum: ReportGroupBy,
    example: ReportGroupBy.DAY 
  })
  @IsOptional()
  @IsEnum(ReportGroupBy)
  groupBy?: ReportGroupBy;
}

