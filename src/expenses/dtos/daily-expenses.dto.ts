import { Expose, Transform } from 'class-transformer';

export class DailyExpensesDto {
  @Expose()
  date: string;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  total: number;

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
}
