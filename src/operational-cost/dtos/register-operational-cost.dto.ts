import {
  IsDateString,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { CostType } from '../enums/operational-cost.enum';

export class RegisterOperationalCostDto {
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
  description: string;
}
