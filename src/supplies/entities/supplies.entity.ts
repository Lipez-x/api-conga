import { Expense } from 'src/expenses/entities/expense.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('supplies')
export class Supplies {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Expense, { cascade: true, nullable: false })
  @JoinColumn()
  expense: Expense;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotalCost() {
    if (this.quantity && this.unitPrice) {
      this.expense.value = Number(this.quantity) * Number(this.unitPrice);
    }
  }
}
