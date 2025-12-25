import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RequestStatus } from '../enums/request-status.enum';
import { User } from 'src/users/entities/user.entity';

@Entity('producer_production_request')
export class ProducerProductionRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'producer_name', type: 'text' })
  producerName: string;

  @Column({
    name: 'total_quantity',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  totalQuantity: number;

  @Column({ type: 'enum', enum: RequestStatus })
  status: RequestStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @DeleteDateColumn()
  validatedAt: Date;
}
