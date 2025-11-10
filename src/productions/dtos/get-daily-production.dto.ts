import { IsDateString, IsOptional } from 'class-validator';

export class GetDailyProductionDto {
  @IsDateString()
  @IsOptional()
  dateFrom?: Date;

  @IsDateString()
  @IsOptional()
  dateTo?: Date;
}
