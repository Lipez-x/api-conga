import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { ExpensesFilter } from './dtos/expenses-filter.dto';
import { ExpenseType } from './enums/expense-type.enum';

@Injectable()
export class ExpensesService {
  private logger = new Logger(ExpensesService.name);
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async getGroupedExpenses(filters: ExpensesFilter) {
    const query = this.expenseRepository.createQueryBuilder('expense');
    const { dateFrom, dateTo } = filters;

    if (dateFrom) query.andWhere('expense.date >= :dateFrom', { dateFrom });
    if (dateTo) query.andWhere('expense.date <= :dateTo', { dateTo });

    try {
      const total = await query
        .select('SUM(expense.value)', 'total')
        .getRawOne();

      const categories = await query
        .addSelect(
          `SUM(expense.value) FILTER (WHERE expense.category = 'PERSONNEL')`,
          'totalPersonnel',
        )
        .addSelect(
          `SUM(expense.value) FILTER (WHERE expense.category = 'UTILITY')`,
          'totalUtility',
        )
        .addSelect(
          `SUM(expense.value) FILTER (WHERE expense.category = 'SUPPLIES')`,
          'totalSupplies',
        )
        .addSelect(
          `SUM(expense.value) FILTER (WHERE expense.category = 'OPERATIONAL')`,
          'totalOperational',
        )
        .getRawOne();

      return {
        total: Number(total.total || 0),
        result: [
          {
            category: ExpenseType.PERSONNEL,
            total: Number(categories.totalPersonnel || 0),
          },
          {
            category: ExpenseType.UTILITY,
            total: Number(categories.totalUtility || 0),
          },
          {
            category: ExpenseType.SUPPLIES,
            total: Number(categories.totalSupplies || 0),
          },
          {
            category: ExpenseType.OPERATIONAL,
            total: Number(categories.totalOperational || 0),
          },
        ],
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
      await this.expenseRepository.delete(id);
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
