import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ExpensesService } from '../expenses/expenses.service';
import { ReceivesService } from '../receives/receives.service';
import { ProductionsService } from '../productions/productions.service';
import { FinancialReportFilterDto } from './dtos/financial-report-filter.dto';
import { Receive } from 'src/receives/entities/receive.entity';

@Injectable()
export class FinancialReportService {
  private logger = new Logger(FinancialReportService.name);

  constructor(
    private readonly expensesService: ExpensesService,
    private readonly receivesService: ReceivesService,
    private readonly productionsService: ProductionsService,
  ) {}

  async getOverview(filters: FinancialReportFilterDto) {
    try {
      const expensesData = await this.expensesService.getGrouped({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      });

      const receivesData = await this.receivesService.getTotal({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      });

      const totalExpenses = Number(expensesData.total.toFixed(2));

      const totalReceives = Number(receivesData.total);

      const periodResult = Number((totalReceives - totalExpenses).toFixed(2));

      return {
        totalReceives,
        totalExpenses,
        periodResult,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }
  }

  async getDetailedReport(filters: FinancialReportFilterDto) {
    try {
      const expensesData = await this.expensesService.getGrouped({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      });

      const productionsData = await this.productionsService.getDaily({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        page: 1,
        limit: 999999,
      });

      let totalLocalProduction = 0;
      let totalProducersProduction = 0;

      productionsData.data.forEach((day: any) => {
        totalLocalProduction += Number(day.totalQuantity || 0);
        totalProducersProduction += Number(day.totalProducers || 0);
      });

      const totalProduction = totalLocalProduction + totalProducersProduction;

      return {
        personnel: Number(expensesData.categories.PERSONNEL.toFixed(2)),
        utility: Number(expensesData.categories.UTILITY.toFixed(2)),
        supplies: Number(expensesData.categories.SUPPLIES.toFixed(2)),
        operational: Number(expensesData.categories.OPERATIONAL.toFixed(2)),
        localProduction: Number(totalLocalProduction.toFixed(2)),
        producerProduction: Number(totalProducersProduction.toFixed(2)),
        totalProduction: Number(totalProduction.toFixed(2)),
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }
  }

  private mergeFinancialData(expenses: any[], receives: Receive[]) {
    const map = new Map();

    expenses.forEach((d) => {
      const existente = map.get(d.date) || {
        date: d.date,
        expenses: 0,
        receives: 0,
      };

      existente.expenses += Number(d.total) || 0;
      map.set(d.date, existente);
    });

    receives.forEach((r) => {
      const existente = map.get(r.date) || {
        date: r.date,
        expenses: 0,
        receives: 0,
      };

      existente.receives += Number(r.totalPrice) || 0;
      map.set(r.date, existente);
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }

  async getDaily(filters: FinancialReportFilterDto) {
    const dailyExpenses = await this.expensesService.getDaily(filters);
    const dailyReceives = (await this.receivesService.findAll(filters)).data;
    const merged = this.mergeFinancialData(dailyExpenses, dailyReceives);

    return merged;
  }
}
