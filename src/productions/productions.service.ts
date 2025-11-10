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
      .addSelect('l.gross_quantity', 'grossQuantity')
      .addSelect('l.consumed_quantity', 'consumedQuantity')
      .addSelect('l.total_quantity', 'totalQuantity')
      .addSelect('COALESCE(SUM(p.total_quantity), 0)', 'totalProducers')
      .from(LocalProduction, 'l')
      .leftJoin(ProducerProduction, 'p', 'p.date = l.date')
      .groupBy('l.date')
      .addGroupBy('l.gross_quantity')
      .addGroupBy('l.consumed_quantity')
      .addGroupBy('l.total_quantity')
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
