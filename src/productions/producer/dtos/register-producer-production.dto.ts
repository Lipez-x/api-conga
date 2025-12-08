import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { IsNotFutureDate } from 'src/common/validators/not-future-date.validator';

export class RegisterProducerProductionDto {
  @IsDateString()
  @IsNotFutureDate({ message: 'A data não pode ser maior que a data atual' })
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  producerName: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  totalQuantity: number;
}
