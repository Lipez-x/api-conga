import { Controller, Get, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesFilter } from './dtos/expenses-filter.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  async getGroupedExpenses(@Query() filters: ExpensesFilter) {
    return await this.expensesService.getGroupedExpenses(filters);
  }
}
