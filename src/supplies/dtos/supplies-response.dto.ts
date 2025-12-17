import { Exclude, Expose, Transform } from 'class-transformer';
import { Expense } from 'src/expenses/entities/expense.entity';

export class SuppliesResponseDto {
  @Expose()
  id: string;

  @Exclude()
  expense: Expense;

  @Expose()
  name: string;

  @Transform(({ obj }) => obj.expense?.date, { toClassOnly: true })
  @Expose()
  date: string;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  quantity: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  unitPrice: number;

  @Transform(({ obj }) => Number(obj.expense?.value) || 0, {
    toClassOnly: true,
  })
  @Expose()
  totalCost: number;
}
