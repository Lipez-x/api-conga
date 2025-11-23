import { IsDateString, IsOptional } from 'class-validator';

export class ExpensesFilter {
  @IsOptional()
  @IsDateString()
  dateFrom?: Date;

  @IsOptional()
  @IsDateString()
  dateTo?: Date;
}
