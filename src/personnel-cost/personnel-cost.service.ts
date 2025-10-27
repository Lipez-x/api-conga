import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RegisterPersonnelCostDto } from './dtos/register-personnel-cost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonnelCost } from './entities/personnel-cost.entity';
import { Repository } from 'typeorm';
import { PersonnelCostFilterDto } from './dtos/personnel-cost-filter.dto';
import { UpdatePersonnelCostDto } from './dtos/update-personnel-cost.dto';

@Injectable()
export class PersonnelCostService {
  private readonly logger = new Logger(PersonnelCostService.name);

  constructor(
    @InjectRepository(PersonnelCost)
    private readonly personnelCostRepository: Repository<PersonnelCost>,
  ) {}

  async register(registerPersonnelCostDto: RegisterPersonnelCostDto) {
    try {
      const personnelCost = this.personnelCostRepository.create({
        ...registerPersonnelCostDto,
      });

      return await this.personnelCostRepository.save(personnelCost);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(filters: PersonnelCostFilterDto) {
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

    const query = this.personnelCostRepository.createQueryBuilder('cost');

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
      const personnelCost = await this.personnelCostRepository.findOne({
        where: { id },
      });

      if (!personnelCost) {
        throw new NotFoundException(
          `Custo com pessoal de id ${id} não encontrado`,
        );
      }

      return personnelCost;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updatePersonnelCostDto: UpdatePersonnelCostDto) {
    try {
      const personnelCost = await this.personnelCostRepository.preload({
        id,
        ...updatePersonnelCostDto,
      });

      if (!personnelCost) {
        throw new NotFoundException(
          `Custo com pessoal de id ${id} não encontrado`,
        );
      }

      return await this.personnelCostRepository.save(personnelCost);
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string) {
    try {
      const personnelCost = await this.personnelCostRepository.findOne({
        where: { id },
      });

      if (!personnelCost) {
        throw new NotFoundException(
          `Custo com pessoal de id ${id} não encontrado`,
        );
      }

      await this.personnelCostRepository.delete(personnelCost);
      return { message: `Custo com pessoal id(${id}) deletado com sucesso` };
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
