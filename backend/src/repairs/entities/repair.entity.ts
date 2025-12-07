import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { Part } from '../../parts/entities/part.entity';
import { RepairTask } from '../../repair-tasks/entities/repair-task.entity';

@Entity('repairs')
export class Repair {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'vehicle_id', type: 'uuid' })
  vehicleId: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.repairs)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column({ name: 'reported_at', type: 'date' })
  reportedAt: Date;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'integer', nullable: true })
  mileage: number;

  @Column({ name: 'labor_total', type: 'numeric', precision: 10, scale: 2, default: 0 })
  laborTotal: number;

  @Column({ name: 'parts_total', type: 'numeric', precision: 10, scale: 2, default: 0 })
  partsTotal: number;

  @Column({ name: 'grand_total', type: 'numeric', precision: 10, scale: 2, default: 0 })
  grandTotal: number;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ name: 'synced_at', type: 'timestamptz', nullable: true })
  syncedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @OneToMany(() => Part, (part) => part.repair)
  parts: Part[];

  @OneToMany(() => RepairTask, (task) => task.repair)
  tasks: RepairTask[];
}
