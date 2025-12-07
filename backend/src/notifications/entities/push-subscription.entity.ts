import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('push_subscriptions')
export class PushSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', name: 'endpoint', unique: true })
  endpoint: string;

  @Column({ type: 'text', name: 'p256dh_key' })
  p256dh: string;

  @Column({ type: 'text', name: 'auth_key' })
  auth: string;

  @Column({ type: 'uuid', name: 'user_id', nullable: true })
  userId?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

