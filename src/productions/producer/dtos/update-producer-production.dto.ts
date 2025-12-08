import { Type } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { IsNotFutureDate } from 'src/common/validators/not-future-date.validator';

export class UpdateProducerProductionDto {
  @IsDateString()
  @IsNotFutureDate({ message: 'A data não pode ser maior que a data atual' })
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
