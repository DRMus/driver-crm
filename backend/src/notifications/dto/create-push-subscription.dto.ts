import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePushSubscriptionDto {
  @ApiProperty({ description: 'Endpoint подписки', example: 'https://fcm.googleapis.com/fcm/send/...' })
  @IsString()
  endpoint: string;

  @ApiProperty({ description: 'P256DH ключ', example: 'BGh...' })
  @IsString()
  p256dh: string;

  @ApiProperty({ description: 'Auth ключ', example: 'auth...' })
  @IsString()
  auth: string;

  @ApiPropertyOptional({ description: 'ID пользователя', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  userId?: string;
}

