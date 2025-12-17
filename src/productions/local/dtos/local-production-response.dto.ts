import { Expose, Transform } from 'class-transformer';

export class LocalProductionResponseDto {
  @Expose()
  id: string;

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
}
