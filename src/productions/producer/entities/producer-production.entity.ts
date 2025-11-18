import { Receive } from 'src/receives/entities/receive.entity';
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

  @Index()
  @ManyToOne(() => Receive, (receive) => receive.producerProductions)
  @JoinColumn({ referencedColumnName: 'date' })
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
}
