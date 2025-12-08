import { Module } from '@nestjs/common';
import { UtilityCostController } from './utility-cost.controller';
import { UtilityCostService } from './utility-cost.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilityCost } from './entities/utility-cost.entity';
import { ExpensesModule } from 'src/expenses/expenses.module';

@Module({
  imports: [TypeOrmModule.forFeature([UtilityCost]), ExpensesModule],
  controllers: [UtilityCostController],
  providers: [UtilityCostService],
  exports: [UtilityCostService],
})
export class UtilityCostModule {}
