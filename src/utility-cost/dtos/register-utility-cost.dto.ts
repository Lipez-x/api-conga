import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { CostType } from '../enums/cost-type.enum';
import { Type } from 'class-transformer';
import { IsNotFutureDate } from 'src/common/validators/not-future-date.validator';

export class RegisterUtilityCostDto {
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
  @IsNotEmpty()
  observations: string;
}
