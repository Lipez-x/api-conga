import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { ExpenseType } from '../enums/expense-type.enum';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  value: number;

  @Column({ type: 'enum', enum: ExpenseType })
  category: ExpenseType;
}
