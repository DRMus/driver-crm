import { IsString, IsOptional, IsEmail, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ description: 'Полное имя клиента', example: 'Иван Петров' })
  @IsString()
  @MaxLength(255)
  fullName: string;

  @ApiPropertyOptional({ description: 'Телефон', example: '+7 900 000 00 00' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ description: 'Email', example: 'client@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ description: 'Адрес', example: 'г. Казань, ул. Лесная 5' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Заметки', example: 'любые пожелания' })
  @IsOptional()
  @IsString()
  notes?: string;
}

