import { Expose, Transform, Type } from 'class-transformer';

export class CostCategoriesDto {
  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  PERSONNEL: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  UTILITY: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  SUPPLIES: number;

  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  OPERATIONAL: number;
}

export class GroupedExpensesDto {
  @Transform(({ value }) => Number(value) || 0)
  @Expose()
  total: number;

  @Expose()
  @Type(() => CostCategoriesDto)
  categories: CostCategoriesDto;
}
