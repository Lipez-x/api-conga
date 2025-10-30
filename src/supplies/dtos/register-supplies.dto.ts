import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class RegisterSuppliesDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quantity: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice: number;
}
