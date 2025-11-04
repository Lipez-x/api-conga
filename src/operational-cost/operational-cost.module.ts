import { Module } from '@nestjs/common';
import { OperationalCostController } from './operational-cost.controller';
import { OperationalCostService } from './operational-cost.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationalCost } from './entities/operational-cost.entity';
import { ExpensesModule } from 'src/expenses/expenses.module';

@Module({
  imports: [TypeOrmModule.forFeature([OperationalCost]), ExpensesModule],
  controllers: [OperationalCostController],
  providers: [OperationalCostService],
  exports: [OperationalCostService],
})
export class OperationalCostModule {}
