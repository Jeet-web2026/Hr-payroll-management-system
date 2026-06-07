import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_employments')
export class UserEmployment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  employeeId!: string;

  @Column({ length: 150 })
  companyName!: string;

  @Column({ length: 100, nullable: true })
  department?: string;

  @Column({ length: 100, nullable: true })
  designation?: string;

  @Column({ length: 100, nullable: true })
  headOfDepartment?: string;

  @Column({ length: 100, nullable: true })
  manager?: string;

  @Column({ type: 'date' })
  joiningDate!: Date;

  @Column({ type: 'date', nullable: true })
  leavingDate?: Date;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  salary?: number;

  @Column({
    length: 50,
    default: 'active',
  })
  employmentStatus!: string;

  @Column({
    length: 50,
    nullable: true,
  })
  employmentType?: string;

  @Column({
    length: 50,
    nullable: true,
  })
  employeeCode?: string;

  @Column({
    length: 100,
    nullable: true,
  })
  workLocation?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  remarks?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => User, (user) => user.employment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user!: User;
}
