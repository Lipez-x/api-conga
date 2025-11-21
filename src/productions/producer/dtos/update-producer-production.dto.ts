import { Type } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { RequestStatus } from '../enums/request-status.enum';
import { IsNull } from 'typeorm';

export class UpdateProducerProductionDto {
  @IsDateString()
  @IsOptional()
  date: Date;

  @IsString()
  @IsOptional()
  producerName: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalQuantity: number;
}
