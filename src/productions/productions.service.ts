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

    const query = this.dataSource
      .createQueryBuilder()
      .select('l.date', 'date')
      .addSelect('SUM(l.gross_quantity)', 'grossQuantity')
      .addSelect('SUM(l.consumed_quantity)', 'consumedQuantity')
      .addSelect('SUM(l.total_quantity)', 'totalQuantity')
      .addSelect(
        (qb) =>
          qb
            .select('COALESCE(SUM(pp.total_quantity), 0)')
            .from(ProducerProduction, 'pp')
            .where('pp.date = l.date'),
        'totalProducers',
      )
      .from(LocalProduction, 'l')
      .groupBy('l.date')
      .orderBy('l.date', 'DESC');

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
