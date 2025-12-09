import { Module } from '@nestjs/common';
import { FinancialReportController } from './financial-report.controller';
import { FinancialReportService } from './financial-report.service';
import { ExpensesModule } from 'src/expenses/expenses.module';
import { ReceivesModule } from 'src/receives/receives.module';
import { ProductionsModule } from 'src/productions/productions.module';
import { PdfService } from './financial-report-pdf.service';

@Module({
  imports: [ExpensesModule, ReceivesModule, ProductionsModule],
  controllers: [FinancialReportController],
  providers: [FinancialReportService, PdfService],
  exports: [FinancialReportService],
})
export class FinancialReportModule {}
