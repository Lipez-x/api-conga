import { Type } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class FilterProductionDto {
  @IsString()
  @IsOptional()
  producerName?: string;

  @IsDateString()
  @IsOptional()
  dateFrom?: Date;

  @IsDateString()
  @IsOptional()
  dateTo?: Date;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  grossQuantityMin?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  grossQuantityMax?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  consumedQuantityMin?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  consumedQuantityMax?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  sellableQuantityMin?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  sellableQuantityMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
