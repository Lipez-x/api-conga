import { Controller, Get, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { PeriodFilter } from 'src/common/dtos/period-filter.dto';
import { MonthlyCompareFilter } from 'src/common/dtos/monthly-comparison-filter.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  async getGroupedExpenses(@Query() filters: PeriodFilter) {
    return await this.expensesService.getGrouped(filters);
  }

  @Get('/compare')
  async compareExpensesByPeriod(@Query() dto: MonthlyCompareFilter) {
    return await this.expensesService.compareByPeriod(dto);
  }

  @Get('/daily')
  async getGroupedByDay(@Query() filters: PeriodFilter) {
    return await this.expensesService.getDaily(filters);
  }
}
