import { IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class FinancialReportFilterDto {
  @IsOptional()
  @Type(() => Date)
  @IsDateString()
  dateFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDateString()
  dateTo?: Date;
}
