import {
  IsDateString,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { CostType } from '../enums/cost-type.enum';

export class RegisterUtilityCostDto {
  @IsEnum(CostType)
  @IsNotEmpty()
  type: CostType;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsNotEmpty()
  observations: string;
}
