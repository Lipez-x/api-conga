import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OperationalCost } from './entities/operational-cost.entity';
import { Repository } from 'typeorm';
import { RegisterOperationalCostDto } from './dtos/register-operational-cost.dto';
import { OperationalCostFilterDto } from './dtos/operational-cost-filter.dto';

@Injectable()
export class OperationalCostService {
  private logger = new Logger(OperationalCostService.name);
  constructor(
    @InjectRepository(OperationalCost)
    private readonly operationalCostRepository: Repository<OperationalCost>,
  ) {}

  async register(registerOperationalCostDto: RegisterOperationalCostDto) {
    try {
      const operationalCost = this.operationalCostRepository.create({
        ...registerOperationalCostDto,
      });

      return await this.operationalCostRepository.save(operationalCost);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(filters: OperationalCostFilterDto) {
    const {
      type,
      dateFrom,
      dateTo,
      minValue,
      maxValue,
      description,
      page = 1,
      limit = 10,
    } = filters;

    const query = this.operationalCostRepository.createQueryBuilder('cost');

    if (type) query.andWhere('cost.type = :type', { type });
    if (dateFrom) query.andWhere('cost.date >= :dateFrom', { dateFrom });
    if (dateTo) query.andWhere('cost.date <= :dateTo', { dateTo });
    if (minValue) query.andWhere('cost.value >= :minValue', { minValue });
    if (maxValue) query.andWhere('cost.value <= :maxValue', { maxValue });
    if (description)
      query.andWhere('cost.description ILIKE :description', {
        description: `%${description}%`,
      });

    try {
      const [data, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

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

  async findById(id: string) {
    try {
      const operationalCost = await this.operationalCostRepository.findOne({
        where: { id },
      });

      if (!operationalCost) {
        throw new NotFoundException(
          `Custo com operacional de id ${id} não encontrado`,
        );
      }

      return operationalCost;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
