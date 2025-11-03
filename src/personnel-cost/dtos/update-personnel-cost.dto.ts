import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CostType } from '../enums/cost-type.enum';
import { Type } from 'class-transformer';

export class UpdatePersonnelCostDto {
  @IsEnum(CostType)
  @IsOptional()
  type: CostType;

  @IsDateString()
  @IsOptional()
  date: Date;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  value: number;

  @IsString()
  @IsOptional()
  description: string;
}
