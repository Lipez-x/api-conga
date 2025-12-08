import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { IsNotFutureDate } from 'src/common/validators/not-future-date.validator';

export class RegisterLocalProductionDto {
  @IsDateString()
  @IsNotFutureDate({ message: 'A data não pode ser maior que a data atual' })
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
