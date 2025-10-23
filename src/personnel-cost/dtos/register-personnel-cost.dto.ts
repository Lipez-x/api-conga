import {
  IsDateString,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { CostType } from '../enums/cost-type.enum';

export class RegisterPersonnelCostDto {
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
