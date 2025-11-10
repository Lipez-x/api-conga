import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('local_production')
export class LocalProduction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'date' })
  date: Date;

  @Column({
    name: 'gross_quantity',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  grossQuantity: number;

  @Column({
    name: 'consumed_quantity',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  consumedQuantity: number;

  @Column({
    name: 'total_quantity',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  totalQuantity: number;

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotalQuantity() {
    this.totalQuantity =
      Number(this.grossQuantity) - Number(this.consumedQuantity);
  }
}
