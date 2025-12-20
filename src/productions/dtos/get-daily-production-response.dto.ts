import { Expose, Transform } from 'class-transformer';

export class GetDailyProductionResponseDto {
  @Expose()
  date: string;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  grossQuantity: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  consumedQuantity: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  totalQuantity: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  totalProducers: number;
}
