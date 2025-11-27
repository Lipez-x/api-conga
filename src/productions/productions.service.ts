import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GetDailyProductionDto } from './dtos/get-daily-production.dto';
import { LocalProduction } from './local/entities/local-production.entity';
import { ProducerProduction } from './producer/entities/producer-production.entity';

@Injectable()
export class ProductionsService {
  private logger = new Logger(ProductionsService.name);
  constructor(private readonly dataSource: DataSource) {}
  async getDailyProduction(filters: GetDailyProductionDto) {
    const { dateFrom, dateTo, page = 1, limit = 10 } = filters;

    const localQuery = this.dataSource
      .createQueryBuilder()
      .select('l.date', 'date')
      .addSelect('SUM(l.gross_quantity)', 'gross_quantity')
      .addSelect('SUM(l.consumed_quantity)', 'consumed_quantity')
      .addSelect('SUM(l.total_quantity)', 'total_quantity')
      .from(LocalProduction, 'l')
      .groupBy('l.date')
      .getQuery();

    const producerQuery = this.dataSource
      .createQueryBuilder()
      .select('pp.date', 'date')
      .addSelect('SUM(pp.total_quantity)', 'total_producers')
      .from(ProducerProduction, 'pp')
      .groupBy('pp.date')
      .getQuery();

    const datesQuery =
      this.dataSource
        .createQueryBuilder()
        .select('l.date', 'date')
        .from(LocalProduction, 'l')
        .getQuery() +
      `
    UNION
    ` +
      this.dataSource
        .createQueryBuilder()
        .select('pp.date', 'date')
        .from(ProducerProduction, 'pp')
        .getQuery();

    const query = this.dataSource
      .createQueryBuilder()
      .select('d.date', 'date')
      .addSelect('COALESCE(l.gross_quantity, 0)', 'grossQuantity')
      .addSelect('COALESCE(l.consumed_quantity, 0)', 'consumedQuantity')
      .addSelect('COALESCE(l.total_quantity, 0)', 'totalQuantity')
      .addSelect('COALESCE(p.total_producers, 0)', 'totalProducers')
      .from(`(${datesQuery})`, 'd')
      .leftJoin(`(${localQuery})`, 'l', 'l.date = d.date')
      .leftJoin(`(${producerQuery})`, 'p', 'p.date = d.date')
      .orderBy('d.date', 'DESC');

    if (dateFrom) query.andWhere('l.date >= :dateFrom', { dateFrom });
    if (dateTo) query.andWhere('l.date <= :dateTo', { dateTo });
    try {
      const data = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getRawMany();

      const total = data.length;

      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
