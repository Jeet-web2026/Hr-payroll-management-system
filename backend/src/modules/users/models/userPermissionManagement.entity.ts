import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_permission_management')
export class UserPermissionManagement {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  permissonIds!: string[];

  @ManyToOne(() => User, (user) => user.permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: User;
}
