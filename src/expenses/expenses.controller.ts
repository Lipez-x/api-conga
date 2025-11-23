import { Controller, Get, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesFilter } from './dtos/expenses-filter.dto';
import { ComparePeriodsDto } from './dtos/compare-periods.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  async getGroupedExpenses(@Query() filters: ExpensesFilter) {
    return await this.expensesService.getGroupedExpenses(filters);
  }

  @Get('/compare')
  async compareExpensesByPeriod(@Query() dto: ComparePeriodsDto) {
    return await this.expensesService.compareExpensesByPeriod(dto);
  }
}
