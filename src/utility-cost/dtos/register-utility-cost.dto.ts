import {
  IsDateString,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { CostType } from '../enums/cost-type.enum';
import { Type } from 'class-transformer';

export class RegisterUtilityCostDto {
  @IsEnum(CostType)
  @IsNotEmpty()
  type: CostType;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsNotEmpty()
  observations: string;
}
