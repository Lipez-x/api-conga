import { Expose, Transform } from 'class-transformer';

export class DailyDto {
  @Expose()
  date: string;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  expenses: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  receives: number;
}
