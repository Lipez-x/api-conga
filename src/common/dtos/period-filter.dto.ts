import { IsDateString, IsOptional } from 'class-validator';

export class PeriodFilter {
  @IsOptional()
  @IsDateString()
  dateFrom?: Date;

  @IsOptional()
  @IsDateString()
  dateTo?: Date;
}
