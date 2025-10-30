import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('supplies')
export class Supplies {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ name: 'total_cost', type: 'decimal', precision: 10, scale: 2 })
  totalCost: number;

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotalCost() {
    if (this.quantity && this.unitPrice) {
      this.totalCost = Number(this.quantity) * Number(this.unitPrice);
    }
  }
}
