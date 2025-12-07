import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountingService } from './accounting.service';
import { AccountingController } from './accounting.controller';
import { Repair } from '../repairs/entities/repair.entity';
import { Part } from '../parts/entities/part.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Repair, Part]),
  ],
  controllers: [AccountingController],
  providers: [AccountingService],
  exports: [AccountingService],
})
export class AccountingModule {}

