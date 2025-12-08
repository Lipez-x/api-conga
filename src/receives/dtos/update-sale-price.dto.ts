import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateSalePriceDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  value: number;
}
