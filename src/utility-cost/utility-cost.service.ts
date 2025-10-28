import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUtilityCostDto } from './dtos/register-utility-cost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilityCost } from './entities/utility-cost.entity';
import { Repository } from 'typeorm';
import { UtilityCostFilterDto } from './dtos/utility-cost-filter.dto';
import { UpdateUtilityCostDto } from './dtos/update-utility-cost.dto';

@Injectable()
export class UtilityCostService {
  private logger = new Logger(UtilityCostService.name);
  constructor(
    @InjectRepository(UtilityCost)
    private readonly utilityCostRepository: Repository<UtilityCost>,
  ) {}

  async register(registerUtilityCostDto: RegisterUtilityCostDto) {
    try {
      const utilityCost = this.utilityCostRepository.create({
        ...registerUtilityCostDto,
      });

      return await this.utilityCostRepository.save(utilityCost);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(filters: UtilityCostFilterDto) {
    const {
      type,
      dateFrom,
      dateTo,
      minValue,
      maxValue,
      observations,
      page = 1,
      limit = 10,
    } = filters;

    const query = this.utilityCostRepository.createQueryBuilder('cost');

    if (type) query.andWhere('cost.type = :type', { type });
    if (dateFrom) query.andWhere('cost.date >= :dateFrom', { dateFrom });
    if (dateTo) query.andWhere('cost.date <= :dateTo', { dateTo });
    if (minValue) query.andWhere('cost.value >= :minValue', { minValue });
    if (maxValue) query.andWhere('cost.value <= :maxValue', { maxValue });
    if (observations)
      query.andWhere('cost.observations ILIKE :description', {
        description: `%${observations}%`,
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
      const utilityCost = await this.utilityCostRepository.findOne({
        where: { id },
      });

      if (!utilityCost) {
        throw new NotFoundException(
          `Custo com utilidade de id ${id} não encontrado`,
        );
      }

      return utilityCost;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateUtilityCostDto: UpdateUtilityCostDto) {
    try {
      const utilityCost = await this.utilityCostRepository.preload({
        id,
        ...updateUtilityCostDto,
      });

      if (!utilityCost) {
        throw new NotFoundException(
          `Custo com utilidade de id ${id} não encontrado`,
        );
      }

      return await this.utilityCostRepository.save(utilityCost);
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
