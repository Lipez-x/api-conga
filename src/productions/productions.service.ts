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
    const { dateFrom, dateTo } = filters;

    const sub =
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
      .addSelect('COALESCE(SUM(l.gross_quantity), 0)', 'grossQuantity')
      .addSelect('COALESCE(SUM(l.consumed_quantity), 0)', 'consumedQuantity')
      .addSelect('COALESCE(SUM(l.total_quantity), 0)', 'totalQuantity')
      .addSelect('COALESCE(SUM(pp.total_quantity), 0)', 'totalProducers')
      .from(`(${sub})`, 'd')
      .leftJoin(LocalProduction, 'l', 'l.date = d.date')
      .leftJoin(ProducerProduction, 'pp', 'pp.date = d.date')
      .groupBy('d.date')
      .orderBy('d.date', 'DESC');

    if (dateFrom) query.andWhere('l.date >= :dateFrom', { dateFrom });
    if (dateTo) query.andWhere('l.date <= :dateTo', { dateTo });
    try {
      return await query.getRawMany();
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
