import { Type } from 'class-transformer';
import { IsDateString, IsOptional, IsNumber, Min } from 'class-validator';
import { IsNotFutureDate } from 'src/common/validators/not-future-date.validator';

export class UpdateLocalProductionDto {
  @IsDateString()
  @IsNotFutureDate({ message: 'A data não pode ser maior que a data atual' })
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
