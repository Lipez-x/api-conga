import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sale_price')
export class SalePrice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;
}
