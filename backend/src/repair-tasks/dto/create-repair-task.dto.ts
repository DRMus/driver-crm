import { IsString, IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRepairTaskDto {
  @ApiProperty({ description: 'ID ремонта', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  repairId: string;

  @ApiProperty({ description: 'Название работы', example: 'Замена масла' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Сумма (руб.)', example: 1500 })
  @IsNumber()
  @Min(0)
  price: number;
}

