import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_permission_management')
export class UserPermissionManagement {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id!: string;

  @Column({
    type: 'uuid',
    nullable: false
  })
  userId!: string;
}
