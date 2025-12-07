import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairTasksService } from './repair-tasks.service';
import { RepairTasksController } from './repair-tasks.controller';
import { RepairTask } from './entities/repair-task.entity';
import { RepairsModule } from '../repairs/repairs.module';

@Module({
  imports: [TypeOrmModule.forFeature([RepairTask]), RepairsModule],
  controllers: [RepairTasksController],
  providers: [RepairTasksService],
  exports: [RepairTasksService],
})
export class RepairTasksModule {}

