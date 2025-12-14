import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export async function paginate<T extends ObjectLiteral, Y>(
  query: SelectQueryBuilder<T>,
  page = 1,
  limit = 10,
) {
  const [data, total] = await query
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    limit,
    data,
  };
}
