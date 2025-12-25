import { Receive } from 'src/receives/entities/receive.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('producer_production')
export class ProducerProduction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Receive, (receive) => receive.localProductions)
  @JoinColumn()
  receive: Receive;

  @Index()
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

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy' })
  createdBy?: User;
}
