import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { UserEmployment } from './userEmplyment.entity';

export enum UserRole {
  ADMIN = 'admin',
  COMPANY = 'company',
  HR = 'hr',
  EMPLOYEE = 'employee',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum LoginStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100, nullable: true })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
  lastName!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 255, select: true })
  password!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role!: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status!: UserStatus;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin!: Date;

  @Column({
    nullable: true,
  })
  ipAddress!: string;

  @Column({ name: 'is_email_verified', type: 'boolean', default: false })
  isEmailVerified!: boolean;

  @Column({ name: 'profile_picture', type: 'text', nullable: true })
  profilePicture!: string;

  @Column({
    type: 'enum',
    enum: LoginStatus,
    nullable: true,
  })
  loginStatus!: LoginStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'otp', type: 'int', nullable: true })
  otp!: number | null;

  @Column({ name: 'otp_expiry', type: 'timestamp', nullable: true })
  otpExpiry!: Date | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;

  @OneToOne(() => UserEmployment, (employment) => employment.user, {
    cascade: true,
  })
  employment!: UserEmployment;
}
