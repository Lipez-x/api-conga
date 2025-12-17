import { Expose, Transform } from 'class-transformer';

export class OverviewFinancialDto {
  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  totalReceives: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  totalExpenses: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  periodResult: number;
}
