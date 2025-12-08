import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ProductionsService } from './productions/productions.service';
import { ExpensesService } from './expenses/expenses.service';
import { ReceivesService } from './receives/receives.service';
import { DataSource } from 'typeorm';
import { ProducerProductionService } from './productions/producer/producer-production.service';
import { SuppliesService } from './supplies/supplies.service';
import { PersonnelCostService } from './personnel-cost/personnel-cost.service';
import { OperationalCostService } from './operational-cost/operational-cost.service';
import { UtilityCostService } from './utility-cost/utility-cost.service';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);
  constructor(
    private readonly producerProductionService: ProducerProductionService,
    private readonly suppliesService: SuppliesService,
    private readonly personnelCostService: PersonnelCostService,
    private readonly operationalCostService: OperationalCostService,
    private readonly utilityCostService: UtilityCostService,
    private readonly productionService: ProductionsService,
    private readonly expensesService: ExpensesService,
    private readonly receivesService: ReceivesService,
  ) {}

  async getDashboard() {
    try {
      const dailyProduction = await this.productionService.getOfTheDay();
      const dailyReceive = await this.receivesService.getOfTheDay();
      const monthlyExpense = await this.expensesService.monthlyTotal();
      const monthlyReceive = await this.receivesService.monthlyTotal();

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

  async getRecords() {
    try {
      const lastProduction = await this.producerProductionService.findLast();
      const lastSupply = await this.suppliesService.findLast();
      const lastPersonnelCost = await this.personnelCostService.findLast();
      const lastOperationalCost = await this.operationalCostService.findLast();
      const lastUtilityCost = await this.utilityCostService.findLast();

      return {
        lastProduction,
        lastSupply,
        lastPersonnelCost,
        lastOperationalCost,
        lastUtilityCost,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
