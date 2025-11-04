import { Module } from '@nestjs/common';
import { PersonnelCostService } from './personnel-cost.service';
import { PersonnelCostController } from './personnel-cost.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonnelCost } from './entities/personnel-cost.entity';
import { ExpensesModule } from 'src/expenses/expenses.module';

@Module({
  imports: [TypeOrmModule.forFeature([PersonnelCost]), ExpensesModule],
  controllers: [PersonnelCostController],
  providers: [PersonnelCostService],
  exports: [PersonnelCostService],
})
export class PersonnelCostModule {}
