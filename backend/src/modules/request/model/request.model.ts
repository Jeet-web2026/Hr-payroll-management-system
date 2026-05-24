import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum RequestStatus {
  PENDING = 'pendiing',
  APPROVED = 'approved',
  NEW = 'new',
  REJECTED = 'rejected',
}

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id!: String;

  @Column()
  name!: String;

  @Column()
  dateFrom!: Date;

  @Column({
    type: 'date',
  })
  dateTo!: Date;

  @Column({
    type: 'text',
  })
  description!: String;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.NEW,
  })
  status!: RequestStatus;

  @Column({
    type: 'text',
  })
  reason!: String;

  @Column()
  userId!: String;
}
