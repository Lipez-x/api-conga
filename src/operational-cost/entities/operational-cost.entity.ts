import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CostType } from '../enums/operational-cost.enum';
import { Expense } from 'src/expenses/entities/expense.entity';

@Entity('operational-cost')
export class OperationalCost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Expense, { cascade: true })
  @JoinColumn()
  expense: Expense;

  @Column({ type: 'enum', enum: CostType })
  type: CostType;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  value: string;

  @Column({ type: 'text' })
  description: string;
}
