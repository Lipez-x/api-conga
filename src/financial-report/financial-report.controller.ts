import {
  Controller,
  Get,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FinancialReportFilterDto } from './dtos/financial-report-filter.dto';
import { FinancialReportService } from './financial-report.service';
import { ComparePeriodsDto } from './dtos/compare-periods-dto';
import type { Response } from 'express';

@Controller('financial-report')
@UsePipes(ValidationPipe)
export class FinancialReportController {
  constructor(
    private readonly financialReportService: FinancialReportService,
  ) {}

  @Get('overview')
  async getOverview(@Query() filters: FinancialReportFilterDto) {
    return await this.financialReportService.getOverview(filters);
  }

  @Get('detailed')
  async getDetailedReport(@Query() filters: FinancialReportFilterDto) {
    return await this.financialReportService.getDetailedReport(filters);
  }

  @Get('/daily')
  async getDaily(@Query() filters: FinancialReportFilterDto) {
    return await this.financialReportService.getDaily(filters);
  }

  @Get('/compare')
  async compareMonths(@Query() dto: ComparePeriodsDto) {
    return await this.financialReportService.compareByPeriod(dto);
  }

  @Get('/pdf')
  async getPdf(
    @Query() filters: FinancialReportFilterDto,
    @Res() res: Response,
  ) {
    const pdf = await this.financialReportService.generatePdf(filters);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=relatorio-financeiro.pdf',
      'Content-Length': pdf.length,
    });

    return res.end(pdf);
  }
}
