import {
  HttpException,
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
import { ExpenseType } from 'src/expenses/enums/expense-type.enum';
import { ExpensesService } from 'src/expenses/expenses.service';
import { applyPeriodFilter } from 'src/common/helpers/apply-period-filters';
import { paginate } from 'src/common/helpers/paginate';

@Injectable()
export class UtilityCostService {
  private logger = new Logger(UtilityCostService.name);
  constructor(
    @InjectRepository(UtilityCost)
    private readonly utilityCostRepository: Repository<UtilityCost>,
    private readonly expensesService: ExpensesService,
  ) {}

  async register(registerUtilityCostDto: RegisterUtilityCostDto) {
    try {
      const utilityCost = this.utilityCostRepository.create({
        expense: {
          date: registerUtilityCostDto.date,
          value: registerUtilityCostDto.value,
          category: ExpenseType.UTILITY,
        },
        ...registerUtilityCostDto,
      });

      await this.utilityCostRepository.save(utilityCost);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(filters: UtilityCostFilterDto) {
    const {
      type,
      minValue,
      maxValue,
      observations,
      page = 1,
      limit = 10,
    } = filters;

    const query = this.utilityCostRepository
      .createQueryBuilder('cost')
      .leftJoinAndSelect('cost.expense', 'expense')
      .orderBy('expense.date', 'DESC');

    applyPeriodFilter(query, filters, { alias: 'expense' });

    if (type) query.andWhere('cost.type = :type', { type });
    if (minValue) query.andWhere('expense.value >= :minValue', { minValue });
    if (maxValue) query.andWhere('expense.value <= :maxValue', { maxValue });
    if (observations)
      query.andWhere('cost.observations ILIKE :observations', {
        observations: `%${observations}%`,
      });

    try {
      return await paginate(query, page, limit);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: string) {
    try {
      const utilityCost = await this.utilityCostRepository.findOne({
        where: { id },
        relations: ['expense'],
      });

      if (!utilityCost) {
        throw new NotFoundException(
          `Custo com utilidade de id ${id} não encontrado`,
        );
      }

      return utilityCost;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async findLast() {
    try {
      const lastCost = await this.utilityCostRepository
        .createQueryBuilder('cost')
        .leftJoinAndSelect('cost.expense', 'expense')
        .orderBy('expense.date', 'DESC')
        .getOne();

      return lastCost;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateUtilityCostDto: UpdateUtilityCostDto) {
    try {
      const utilityCost = await this.utilityCostRepository.findOne({
        where: { id },
        relations: ['expense'],
      });

      if (!utilityCost) {
        throw new NotFoundException(
          `Custo com utilidade de id ${id} não encontrado`,
        );
      }

      Object.assign(utilityCost, updateUtilityCostDto);
      if (updateUtilityCostDto.date || updateUtilityCostDto.value) {
        Object.assign(utilityCost.expense, {
          date: updateUtilityCostDto.date,
          value: updateUtilityCostDto.value,
        });
      }

      await this.utilityCostRepository.save(utilityCost);
      return {
        message: `Custo com utilidade id(${id}) atualizado com sucesso`,
      };
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string) {
    try {
      const utilityCost = await this.utilityCostRepository.findOne({
        where: { id },
        relations: ['expense'],
      });

      if (!utilityCost) {
        throw new NotFoundException(
          `Custo com utilidade de id ${id} não encontrado`,
        );
      }

      await this.expensesService.delete(utilityCost.expense.id);
      return { message: `Custo com utilidade id(${id}) deletado com sucesso` };
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
