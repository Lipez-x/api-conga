import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Validate,
} from 'class-validator';

export class RegisterProductionDto {
  @IsString()
  @IsNotEmpty()
  producerName: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  grossQuantity: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  consumedQuantity: number;
}
