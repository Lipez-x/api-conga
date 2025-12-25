import { Type } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
  IsString,
  IsEnum,
} from 'class-validator';
import { RequestStatus } from '../enums/request-status.enum';

export class FilterProducerProductionDto {
  @IsDateString()
  @IsOptional()
  dateFrom?: Date;

  @IsDateString()
  @IsOptional()
  dateTo?: Date;

  @IsString()
  @IsOptional()
  producerName?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalQuantityMin?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalQuantityMax?: number;

  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

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
