import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationStatus } from '../enums/notificationStatus.enum';
import { NotificationType } from '../enums/notificationType.enum';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.USER_NOTIFICATION,
  })
  notificationType!: NotificationType;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  subject!: string;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.NEW,
  })
  status!: NotificationStatus;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @Index()
  userId!: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  readAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
