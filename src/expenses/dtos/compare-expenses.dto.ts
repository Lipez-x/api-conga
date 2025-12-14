import { Expose, Type } from 'class-transformer';
import { GroupedExpensesDto } from './grouped-expenses.dto';

export class CompareExpensesDto {
  @Expose()
  @Type(() => GroupedExpensesDto)
  monthOneData: GroupedExpensesDto[];

  @Expose()
  @Type(() => GroupedExpensesDto)
  monthTwoData: GroupedExpensesDto[];
}
