import { Expose, Transform } from 'class-transformer';

export class GetGroupedProductionDto {
  @Expose()
  month: string;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  localTotal: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  producerTotal: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  total: number;
}
