import { Exclude, Expose, Transform } from 'class-transformer';
import { Expense } from 'src/expenses/entities/expense.entity';

export class ProducerProductionResponseDto {
  @Expose()
  id: string;

  // @Transform(({ obj }) => obj.expense?.date, { toClassOnly: true })
  @Expose()
  date: string;

  @Expose()
  producerName: string;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  totalQuantity: number;
}
