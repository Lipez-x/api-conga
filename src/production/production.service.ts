import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RegisterProductionDto } from './dtos/register-production.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalProduction } from './entities/local-production.entity';
import { Repository } from 'typeorm';
import { FilterProductionDto } from './dtos/filter-production.dtos';

@Injectable()
export class ProductionService {
  private logger = new Logger(ProductionService.name);

  constructor(
    @InjectRepository(LocalProduction)
    private readonly productionRepository: Repository<LocalProduction>,
  ) {}

  async register(registerProductionDto: RegisterProductionDto) {
    try {
      const production = this.productionRepository.create({
        ...registerProductionDto,
      });

      return await this.productionRepository.save(production);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(filters: FilterProductionDto) {
    const {
      producerName,
      dateFrom,
      dateTo,
      grossQuantityMin,
      grossQuantityMax,
      consumedQuantityMin,
      consumedQuantityMax,
      sellableQuantityMin,
      sellableQuantityMax,
      page = 1,
      limit = 10,
    } = filters;

    const query = this.productionRepository.createQueryBuilder('production');

    if (producerName)
      query.andWhere('production.producer_name ILIKE :producerName', {
        producerName: `%${producerName}%`,
      });

    if (dateFrom) query.andWhere('production.date >= :dateFrom', { dateFrom });
    if (dateTo) query.andWhere('production.date <= :dateTo', { dateTo });
    if (grossQuantityMin)
      query.andWhere('production.gross_quantity >= :grossQuantityMin', {
        grossQuantityMin,
      });
    if (grossQuantityMax)
      query.andWhere('production.gross_quantity <= :grossQuantityMax', {
        grossQuantityMax,
      });
    if (consumedQuantityMin)
      query.andWhere('production.consumed_quantity >= :consumedQuantityMin', {
        consumedQuantityMin,
      });
    if (consumedQuantityMax)
      query.andWhere('production.consumed_quantity <= :consumedQuantityMax', {
        consumedQuantityMax,
      });
    if (sellableQuantityMin)
      query.andWhere('production.sellable_quantity >= :sellableQuantityMin', {
        sellableQuantityMin,
      });
    if (sellableQuantityMax)
      query.andWhere('production.sellable_quantity <= :sellableQuantityMax', {
        sellableQuantityMax,
      });

    try {
      const [rows, total] = await query
        .skip((page - 1) * limit)
        .take(10)
        .getManyAndCount();

      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: rows,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
