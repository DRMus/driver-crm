import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { RepairsModule } from './repairs/repairs.module';
import { PartsModule } from './parts/parts.module';
import { RepairTasksModule } from './repair-tasks/repair-tasks.module';
import { SyncModule } from './sync/sync.module';
import { SettingsModule } from './settings/settings.module';
import { CalendarModule } from './calendar/calendar.module';
import { AccountingModule } from './accounting/accounting.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // SupabaseModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'aws-1-eu-west-2.pooler.supabase.com'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres.rtcmetwvrrsqeklwwbij'),
        password: configService.get('DB_PASSWORD', 'tobbackno73ru'),
        database: configService.get('DB_DATABASE', 'postgres'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
        retryAttempts: 3,
        retryDelay: 3000,
      }),
      inject: [ConfigService],
    }),
    ClientsModule,
    VehiclesModule,
    RepairsModule,
    PartsModule,
    RepairTasksModule,
    SyncModule,
    SettingsModule,
    CalendarModule,
    AccountingModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
