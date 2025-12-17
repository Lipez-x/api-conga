import { Exclude, Expose, Transform } from 'class-transformer';
import { Expense } from 'src/expenses/entities/expense.entity';

export class OperationalCostResponseDto {
  @Expose()
  id: string;

  @Exclude()
  expense: Expense;

  @Expose()
  type: string;

  @Transform(({ obj }) => obj.expense?.date, { toClassOnly: true })
  @Expose()
  date: string;

  @Transform(({ obj }) => Number(obj.expense?.value) || 0, {
    toClassOnly: true,
  })
  @Expose()
  value: number;

  @Expose()
  description?: string;
}
