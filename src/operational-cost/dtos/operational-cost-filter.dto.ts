import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CostType } from '../enums/operational-cost.enum';
import { Type } from 'class-transformer';

export class OperationalCostFilterDto {
  @IsOptional()
  @IsEnum(CostType)
  type?: CostType;

  @IsOptional()
  @IsDateString()
  dateFrom?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsDateString()
  dateTo?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minValue?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxValue?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
