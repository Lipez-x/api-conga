import { IsOptional, IsDateString } from 'class-validator';

export class ComparePeriodsDto {
  @IsOptional()
  @IsDateString()
  dateFromOne: Date;

  @IsOptional()
  @IsDateString()
  dateToOne: Date;

  @IsOptional()
  @IsDateString()
  dateFromTwo: Date;

  @IsOptional()
  @IsDateString()
  dateToTwo: Date;
}
