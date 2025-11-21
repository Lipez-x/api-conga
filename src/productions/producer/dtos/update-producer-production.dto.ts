import { Type } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

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
