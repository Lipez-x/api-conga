import { Controller } from '@nestjs/common';
import { FinancialReportService } from './financial-report.service';

@Controller('financial-report')
export class FinancialReportController {
  constructor(
    private readonly financialReportService: FinancialReportService,
  ) {}
}
