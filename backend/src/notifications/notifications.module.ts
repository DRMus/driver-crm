import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PushSubscription } from './entities/push-subscription.entity';
import { CalendarModule } from '../calendar/calendar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PushSubscription]),
    ScheduleModule.forRoot(),
    CalendarModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

