import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Repair } from '../../repairs/entities/repair.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'client_id', type: 'uuid' })
  clientId: string;

  @ManyToOne(() => Client, (client) => client.vehicles)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ type: 'text' })
  make: string;

  @Column({ type: 'text' })
  model: string;

  @Column({ type: 'integer', nullable: true })
  year: number;

  @Column({ name: 'plate_number', type: 'citext', nullable: true })
  plateNumber: string;

  @Column({ type: 'citext', nullable: true })
  vin: string;

  @Column({ type: 'text', nullable: true })
  engine: string;

  @Column({ type: 'text', nullable: true })
  transmission: string;

  @Column({ type: 'text', nullable: true })
  color: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @OneToMany(() => Repair, (repair) => repair.vehicle)
  repairs: Repair[];
}

