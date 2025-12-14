import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PeriodFilter } from 'src/common/dtos/period-filter.dto';

interface ApplyPeriodFilterOptions {
  alias: string;
}

export function applyPeriodFilter<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  filters: PeriodFilter,
  options: ApplyPeriodFilterOptions,
): SelectQueryBuilder<T> {
  const { alias } = options;
  const { dateFrom, dateTo } = filters;

  if (dateFrom) {
    query.andWhere(`${alias}.date >= :dateFrom`, { dateFrom });
  }

  if (dateTo) {
    query.andWhere(`${alias}.date <= :dateTo`, { dateTo });
  }

  return query;
}
