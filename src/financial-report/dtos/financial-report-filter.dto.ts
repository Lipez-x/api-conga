import { IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class FinancialReportFilterDto {
  @IsOptional()
  @IsDateString()
  dateFrom?: Date;

  @IsOptional()
  @IsDateString()
  dateTo?: Date;
}
