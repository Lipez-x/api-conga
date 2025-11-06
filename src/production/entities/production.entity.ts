import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('production')
export class Production {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'producer_name', type: 'text' })
  producerName: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'gross_quantity', type: 'decimal', precision: 10, scale: 2 })
  grossQuantity: number;

  @Column({
    name: 'consumed_quantity',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  consumedQuantity: number;

  @Column({
    name: 'sellable_quantity',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  sellableQuantity: number;

  @BeforeInsert()
  @BeforeUpdate()
  calculateSellableQuantity() {
    this.sellableQuantity =
      Number(this.grossQuantity) - Number(this.consumedQuantity);
  }
}
