import { Module } from '@nestjs/common';
import { FinancialReportController } from './financial-report.controller';
import { FinancialReportService } from './financial-report.service';

@Module({
  controllers: [FinancialReportController],
  providers: [FinancialReportService],
})
export class FinancialReportModule {}
