import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ProductionsService } from './productions/productions.service';
import { ExpensesService } from './expenses/expenses.service';
import { ReceivesService } from './receives/receives.service';
import { ProducerProductionRequestService } from './productions/producer/producer-production-request.service';
import { RequestStatus } from './productions/producer/enums/request-status.enum';
import { FilterProducerProductionDto } from './productions/producer/dtos/filter-producer-production.dto';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);
  constructor(
    private readonly productionService: ProductionsService,
    private readonly expensesService: ExpensesService,
    private readonly receivesService: ReceivesService,
  ) {}

  async getDashboard() {
    try {
      const dailyProduction = await this.productionService.getProductionDay();
      const dailyReceive = await this.receivesService.getReceiveDay();
      const monthlyExpense = await this.expensesService.totalExpenseMonth();
      const monthlyReceive = await this.receivesService.totalReceiveMonth();

      return {
        dailyProduction: Number(dailyProduction),
        dailyReceive: Number(dailyReceive),
        monthlyExpense: Number(monthlyExpense),
        monthlyReceive: Number(monthlyReceive),
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
