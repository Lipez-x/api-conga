import { Controller, Get, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesFilter } from './dtos/expenses-filter.dto';
import { ComparePeriodsDto } from './dtos/compare-periods.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  async getGroupedExpenses(@Query() filters: ExpensesFilter) {
    return await this.expensesService.getGrouped(filters);
  }

  @Get('/compare')
  async compareExpensesByPeriod(@Query() dto: ComparePeriodsDto) {
    return await this.expensesService.compareByPeriod(dto);
  }

  @Get('/daily')
  async getGroupedByDay(@Query() filters: ExpensesFilter) {
    return await this.expensesService.getDaily(filters);
  }
}
