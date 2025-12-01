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
import { ComparePeriodsDto } from './dtos/compare-periods.dto';

@Injectable()
export class ExpensesService {
  private logger = new Logger(ExpensesService.name);
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  private format = (value: number) => Number(value.toFixed(2));

  async getGrouped(filters: ExpensesFilter) {
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
        categories: {
          PERSONNEL: Number(categories.totalPersonnel || 0),
          UTILITY: Number(categories.totalUtility || 0),
          SUPPLIES: Number(categories.totalSupplies || 0),
          OPERATIONAL: Number(categories.totalOperational || 0),
        },
      };
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async compareByPeriod(dto: ComparePeriodsDto) {
    const { dateFromOne, dateToOne, dateFromTwo, dateToTwo } = dto;

    const periodOne = await this.getGrouped({
      dateFrom: dateFromOne,
      dateTo: dateToOne,
    });

    const periodTwo = await this.getGrouped({
      dateFrom: dateFromTwo,
      dateTo: dateToTwo,
    });

    const difference = {
      total: this.format(periodOne.total - periodTwo.total),
      categories: {
        PERSONNEL: this.format(
          periodOne.categories.PERSONNEL - periodTwo.categories.PERSONNEL,
        ),
        UTILITY: this.format(
          periodOne.categories.UTILITY - periodTwo.categories.UTILITY,
        ),
        SUPPLIES: this.format(
          periodOne.categories.SUPPLIES - periodTwo.categories.SUPPLIES,
        ),
        OPERATIONAL: this.format(
          periodOne.categories.OPERATIONAL - periodTwo.categories.OPERATIONAL,
        ),
      },
    };

    return {
      periodOne,
      periodTwo,
      difference,
    };
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

  async monthlyTotal() {
    const currentDate = new Date();
    const startDateMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );

    const endDateMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );
    try {
      const expenseSum = await this.expenseRepository
        .createQueryBuilder('expense')
        .select('SUM(expense.value)', 'total')
        .where('expense.date BETWEEN :start AND :end', {
          start: startDateMonth,
          end: endDateMonth,
        })
        .getRawOne();

      return Number(expenseSum.total).toFixed(2) || 0;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
