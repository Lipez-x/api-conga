import { Type } from 'class-transformer';
import { IsDateString, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateLocalProductionDto {
  @IsDateString()
  @IsOptional()
  date?: Date;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  grossQuantity?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  consumedQuantity?: number;
}
