import { Expose, Transform } from 'class-transformer';

export class DetailedDto {
  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  personnel: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  utility: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  supplies: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  operational: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  localProduction: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  producerProduction: number;
}
