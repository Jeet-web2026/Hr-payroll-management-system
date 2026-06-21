import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_details')
export class UserDetails {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  dob!: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  address!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  companyUanNumber?: string;

  @OneToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User;
}
