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

@Entity('parts')
export class Part {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'repair_id', type: 'uuid' })
  repairId: string;

  @ManyToOne(() => Repair, (repair) => repair.parts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'repair_id' })
  repair: Repair;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'citext', nullable: true })
  sku: string;

  @Column({ name: 'purchase_price', type: 'numeric', precision: 10, scale: 2, default: 0 })
  purchasePrice: number;

  @Column({ name: 'sale_price', type: 'numeric', precision: 10, scale: 2, default: 0 })
  salePrice: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 1 })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  supplier: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

