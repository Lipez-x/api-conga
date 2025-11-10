import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RegisterLocalProductionDto } from './dtos/register-local-production.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalProduction } from './entities/local-production.entity';
import { Filter, Repository } from 'typeorm';
import { FilterLocalProductionDto } from './dtos/filter-local-production.dtos';

@Injectable()
export class LocalProductionService {
  private logger = new Logger(LocalProduction.name);

  constructor(
    @InjectRepository(LocalProduction)
    private readonly productionRepository: Repository<LocalProduction>,
  ) {}

  async register(registerLocalProductionDto: RegisterLocalProductionDto) {
    try {
      const production = this.productionRepository.create({
        ...registerLocalProductionDto,
      });

      return await this.productionRepository.save(production);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(filters: FilterLocalProductionDto) {
    const {
      dateFrom,
      dateTo,
      grossQuantityMin,
      grossQuantityMax,
      consumedQuantityMin,
      consumedQuantityMax,
      totalQuantityMin,
      totalQuantityMax,
      page = 1,
      limit = 10,
    } = filters;

    const query = this.productionRepository.createQueryBuilder('production');

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
    if (totalQuantityMin)
      query.andWhere('production.total_quantity >= :totalQuantityMin', {
        totalQuantityMin,
      });
    if (totalQuantityMax)
      query.andWhere('production.total_quantity <= :totalQuantityMax', {
        totalQuantityMax,
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
