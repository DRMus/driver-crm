import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('calendar_events')
export class CalendarEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'event_date', type: 'timestamptz' })
  eventDate: Date;

  @Column({ name: 'reminder_at', type: 'timestamptz', nullable: true })
  reminderAt: Date;

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ type: 'text', nullable: true })
  color: string;

  @Column({ name: 'related_repair_id', type: 'uuid', nullable: true })
  relatedRepairId: string;

  @Column({ name: 'related_client_id', type: 'uuid', nullable: true })
  relatedClientId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date;
}

