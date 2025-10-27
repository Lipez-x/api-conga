import {
  IsDateString,
  IsDecimal,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { CostType } from '../enums/cost-type.enum';

export class UpdatePersonnelCostDto {
  @IsEnum(CostType)
  @IsOptional()
  type: CostType;

  @IsDateString()
  @IsOptional()
  date: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  value: string;

  @IsString()
  @IsOptional()
  description: string;
}
