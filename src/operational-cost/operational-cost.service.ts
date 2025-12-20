import {
  HttpException,
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
import { UpdateOperationalCostDto } from './dtos/update-operational-cost.dto';
import { ExpenseType } from 'src/expenses/enums/expense-type.enum';
import { ExpensesService } from 'src/expenses/expenses.service';
import { applyPeriodFilter } from 'src/common/helpers/apply-period-filters';
import { paginate } from 'src/common/helpers/paginate';

@Injectable()
export class OperationalCostService {
  private logger = new Logger(OperationalCostService.name);
  constructor(
    @InjectRepository(OperationalCost)
    private readonly operationalCostRepository: Repository<OperationalCost>,
    private readonly expensesService: ExpensesService,
  ) {}

  async register(dto: RegisterOperationalCostDto) {
    try {
      const operationalCost = this.operationalCostRepository.create({
        expense: {
          date: dto.date,
          value: dto.value,
          category: ExpenseType.OPERATIONAL,
        },
        ...dto,
      });

      await this.operationalCostRepository.save(operationalCost);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(filters: OperationalCostFilterDto) {
    const {
      type,
      minValue,
      maxValue,
      description,
      page = 1,
      limit = 10,
    } = filters;

    const query = this.operationalCostRepository
      .createQueryBuilder('cost')
      .leftJoinAndSelect('cost.expense', 'expense')
      .orderBy('expense.date', 'DESC');

    applyPeriodFilter(query, filters, { alias: 'expense' });

    if (type) query.andWhere('cost.type = :type', { type });
    if (minValue) query.andWhere('expense.value >= :minValue', { minValue });
    if (maxValue) query.andWhere('expense.value <= :maxValue', { maxValue });
    if (description)
      query.andWhere('cost.description ILIKE :description', {
        description: `%${description}%`,
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
      const operationalCost = await this.operationalCostRepository.findOne({
        where: { id },
        relations: ['expense'],
      });

      if (!operationalCost) {
        throw new NotFoundException(
          `Custo com operacional de id ${id} não encontrado`,
        );
      }

      return operationalCost;
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
      const lastCost = await this.operationalCostRepository
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

  async update(id: string, dto: UpdateOperationalCostDto) {
    try {
      const operationalCost = await this.operationalCostRepository.findOne({
        where: { id },
        relations: ['expense'],
      });

      if (!operationalCost) {
        throw new NotFoundException(
          `Custo com operacional de id ${id} não encontrado`,
        );
      }

      Object.assign(operationalCost, dto);
      if (dto.date || dto.value) {
        Object.assign(operationalCost.expense, {
          date: dto.date,
          value: dto.value,
        });
      }

      await this.operationalCostRepository.save(operationalCost);
      return {
        message: `Custo com operacional id(${id}) atualizado com sucesso`,
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
      const operationalCost = await this.operationalCostRepository.findOne({
        where: { id },
        relations: ['expense'],
      });

      if (!operationalCost) {
        throw new NotFoundException(
          `Custo com operacional de id ${id} não encontrado`,
        );
      }

      await this.expensesService.delete(operationalCost.expense.id);
      return {
        message: `Custo com operacional id(${id}) deletado com sucesso`,
      };
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
