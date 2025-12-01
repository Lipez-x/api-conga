import { IsDateString, IsOptional } from 'class-validator';

export class FinancialReportFilterDto {
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
