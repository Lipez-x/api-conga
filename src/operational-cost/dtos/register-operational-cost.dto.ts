import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CostType } from '../enums/operational-cost.enum';
import { Type } from 'class-transformer';
import { IsNotFutureDate } from 'src/common/validators/not-future-date.validator';

export class RegisterOperationalCostDto {
  @IsEnum(CostType)
  @IsNotEmpty()
  type: CostType;

  @IsDateString()
  @IsNotFutureDate({ message: 'A data não pode ser maior que a data atual' })
  @IsNotEmpty()
  date: Date;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsOptional()
  description?: string;
}
