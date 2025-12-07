import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { Client } from '../clients/entities/client.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Repair } from '../repairs/entities/repair.entity';
import { RepairTask } from '../repair-tasks/entities/repair-task.entity';
import { Part } from '../parts/entities/part.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, Vehicle, Repair, RepairTask, Part]),
  ],
  controllers: [SyncController],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}

