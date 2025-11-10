import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('producer_production')
export class ProducerProduction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'producer_name', type: 'text' })
  producer_name: string;

  @Column({
    name: 'total_quantity',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  totalQuantity: number;
}
