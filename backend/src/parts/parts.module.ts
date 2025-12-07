import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartsService } from './parts.service';
import { PartsController } from './parts.controller';
import { Part } from './entities/part.entity';
import { RepairsModule } from '../repairs/repairs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Part]), RepairsModule],
  controllers: [PartsController],
  providers: [PartsService],
  exports: [PartsService],
})
export class PartsModule {}

