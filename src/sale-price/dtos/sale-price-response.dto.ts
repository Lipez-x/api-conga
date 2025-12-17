import { Expose, Transform } from 'class-transformer';

export class SalePriceResponseDto {
  @Expose()
  id: string;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  value: number;

  @Expose()
  startDate: string;

  @Expose()
  endDate: string;
}
