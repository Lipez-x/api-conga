import { Controller, Get, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { PeriodFilter } from 'src/common/dtos/period-filter.dto';
import { MonthlyCompareFilter } from 'src/common/dtos/monthly-comparison-filter.dto';
import { GroupedExpensesDto } from './dtos/grouped-expenses.dto';
import { plainToInstance } from 'class-transformer';
import { DailyExpensesDto } from './dtos/daily-expenses.dto';
import { CompareExpensesDto } from './dtos/compare-expenses.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  async getGrouped(
    @Query() filters: PeriodFilter,
  ): Promise<GroupedExpensesDto> {
    const grouped = await this.expensesService.getGrouped(filters);
    return plainToInstance(GroupedExpensesDto, grouped);
  }

  @Get('/compare')
  async compareByPeriod(
    @Query() filters: MonthlyCompareFilter,
  ): Promise<CompareExpensesDto> {
    const result = await this.expensesService.compareByPeriod(filters);
    return plainToInstance(CompareExpensesDto, result);
  }

  @Get('/daily')
  async getGroupedByDay(
    @Query() filters: PeriodFilter,
  ): Promise<DailyExpensesDto[]> {
    const daily = await this.expensesService.getDaily(filters);
    return plainToInstance(DailyExpensesDto, daily);
  }
}
