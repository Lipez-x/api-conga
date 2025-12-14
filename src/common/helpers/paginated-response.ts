import { ClassConstructor, plainToInstance } from 'class-transformer';
import { PaginationResult } from './paginate';

export function paginatedResponse<T, R>(
  result: PaginationResult<T>,
  dto: ClassConstructor<R>,
) {
  return {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: Math.ceil(result.total / result.limit),
    data: plainToInstance(dto, result.data),
  };
}
