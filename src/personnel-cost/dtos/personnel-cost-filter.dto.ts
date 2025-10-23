import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CostType } from '../enums/cost-type.enum';

export class PersonnelCostFilterDto {
  @IsOptional()
  @IsEnum(CostType)
  type?: CostType;

  @IsOptional()
  @IsDate()
  dateFrom?: Date;

  @IsOptional()
  @IsDate()
  dateTo?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxValue?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
