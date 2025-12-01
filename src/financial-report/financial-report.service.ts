import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ExpensesService } from '../expenses/expenses.service';
import { ReceivesService } from '../receives/receives.service';
import { FinancialReportFilterDto } from './dtos/financial-report-filter.dto';

@Injectable()
export class FinancialReportService {
  private logger = new Logger(FinancialReportService.name);

  constructor(
    private readonly expensesService: ExpensesService,
    private readonly receivesService: ReceivesService,
  ) {}

  async getOverview(filters: FinancialReportFilterDto) {
    try {
      const expensesData = await this.expensesService.getGrouped({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      });

      const receivesData = await this.receivesService.findAll({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        page: 1,
        limit: 1,
      });

      const totalDespesa = Number(expensesData.total.toFixed(2));

      const totalReceita = Number(receivesData.monthly);

      const resultadoMensal = Number((totalReceita - totalDespesa).toFixed(2));

      return {
        totalReceita,
        totalDespesa,
        resultadoMensal,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }
  }
}
