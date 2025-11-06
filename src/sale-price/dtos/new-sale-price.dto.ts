import { Type } from 'class-transformer';
import { IsNumber, Min, IsNotEmpty } from 'class-validator';

export class NewSalePriceDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  value: number;
}
