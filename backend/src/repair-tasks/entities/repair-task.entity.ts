import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Repair } from '../../repairs/entities/repair.entity';

@Entity('repair_tasks')
export class RepairTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'repair_id', type: 'uuid' })
  repairId: string;

  @ManyToOne(() => Repair, (repair) => repair.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'repair_id' })
  repair: Repair;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  price: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

