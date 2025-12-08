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
import { UpdateOperationalCostDto } from './dtos/update-operational-cost.dto';
import { ExpenseType } from 'src/expenses/enums/expense-type.enum';
import { ExpensesService } from 'src/expenses/expenses.service';

@Injectable()
export class OperationalCostService {
  private logger = new Logger(OperationalCostService.name);
  constructor(
    @InjectRepository(OperationalCost)
    private readonly operationalCostRepository: Repository<OperationalCost>,
    private readonly expensesService: ExpensesService,
  ) {}

  async register(registerOperationalCostDto: RegisterOperationalCostDto) {
    try {
      const operationalCost = this.operationalCostRepository.create({
        expense: {
          date: registerOperationalCostDto.date,
          value: registerOperationalCostDto.value,
          category: ExpenseType.OPERATIONAL,
        },
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

    const query = this.operationalCostRepository
      .createQueryBuilder('cost')
      .leftJoinAndSelect('cost.expense', 'expense')
      .orderBy('expense.date', 'DESC');

    if (type) query.andWhere('cost.type = :type', { type });
    if (dateFrom) query.andWhere('expense.date >= :dateFrom', { dateFrom });
    if (dateTo) query.andWhere('expense.date <= :dateTo', { dateTo });
    if (minValue) query.andWhere('expense.value >= :minValue', { minValue });
    if (maxValue) query.andWhere('expense.value <= :maxValue', { maxValue });
    if (description)
      query.andWhere('cost.description ILIKE :description', {
        description: `%${description}%`,
      });

    try {
      const [rows, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      const data = rows.map((item) => ({
        id: item.id,
        type: item.type,
        date: item.expense.date,
        value: item.expense.value,
        description: item.description,
      }));

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
        relations: ['expense'],
      });

      if (!operationalCost) {
        throw new NotFoundException(
          `Custo com operacional de id ${id} não encontrado`,
        );
      }

      const formattedOperationalCost = {
        id: operationalCost.id,
        type: operationalCost.type,
        date: operationalCost.expense.date,
        value: operationalCost.expense.value,
        description: operationalCost.description,
      };

      return formattedOperationalCost;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
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
        .limit(1)
        .getOne();

      return lastCost;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateOperationalCostDto: UpdateOperationalCostDto) {
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

      Object.assign(operationalCost, updateOperationalCostDto);
      if (updateOperationalCostDto.date || updateOperationalCostDto.value) {
        Object.assign(operationalCost.expense, {
          date: updateOperationalCostDto.date,
          value: updateOperationalCostDto.value,
        });
      }

      await this.operationalCostRepository.save(operationalCost);
      return {
        message: `Custo com operacional id(${id}) atualizado com sucesso`,
      };
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

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
