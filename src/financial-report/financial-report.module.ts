import { Module } from '@nestjs/common';
import { FinancialReportController } from './financial-report.controller';
import { FinancialReportService } from './financial-report.service';
import { ExpensesModule } from 'src/expenses/expenses.module';
import { ReceivesModule } from 'src/receives/receives.module';

@Module({
  imports: [ExpensesModule, ReceivesModule],
  controllers: [FinancialReportController],
  providers: [FinancialReportService],
})
export class FinancialReportModule {}
