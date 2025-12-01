import { IsDateString, IsOptional } from 'class-validator';

export class LocalProductionPeriodFilter {
  @IsOptional()
  @IsDateString()
  dateFrom?: Date;

  @IsOptional()
  @IsDateString()
  dateTo?: Date;
}
