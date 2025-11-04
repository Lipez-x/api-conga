import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CostType } from '../enums/cost-type.enum';
import { Expense } from 'src/expenses/entities/expense.entity';

@Entity('personnel_cost')
export class PersonnelCost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Expense, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  expense: Expense;

  @Column({ type: 'enum', enum: CostType })
  type: CostType;

  @Column({ type: 'text' })
  description: string;
}
