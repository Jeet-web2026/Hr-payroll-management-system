import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserPermissions {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
  })
  permissionvalue!: string;
}
