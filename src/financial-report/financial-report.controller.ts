import {
  Controller,
  Get,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Response } from 'express';
import { PeriodFilter } from 'src/common/dtos/period-filter.dto';
import { MonthlyCompareFilter } from 'src/common/dtos/monthly-comparison-filter.dto';
import { FinancialReportService } from './financial-report.service';

@Controller('financial-report')
@UsePipes(ValidationPipe)
export class FinancialReportController {
  constructor(
    private readonly financialReportService: FinancialReportService,
  ) {}

  @Get('overview')
  async getOverview(@Query() filters: PeriodFilter) {
    return await this.financialReportService.getOverview(filters);
  }

  @Get('detailed')
  async getDetailedReport(@Query() filters: PeriodFilter) {
    return await this.financialReportService.getDetailedReport(filters);
  }

  @Get('/daily')
  async getDaily(@Query() filters: PeriodFilter) {
    return await this.financialReportService.getDaily(filters);
  }

  @Get('/compare')
  async compareMonths(@Query() filters: MonthlyCompareFilter) {
    return await this.financialReportService.compareByPeriod(filters);
  }

  @Get('/pdf')
  async getPdf(@Query() filters: PeriodFilter, @Res() res: Response) {
    const pdf = await this.financialReportService.generatePdf(filters);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=relatorio-financeiro.pdf',
      'Content-Length': pdf.length,
    });

    return res.end(pdf);
  }
}
