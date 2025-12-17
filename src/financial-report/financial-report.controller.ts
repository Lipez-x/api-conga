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
import { OverviewFinancialDto } from './dtos/overview-financial.dto';
import { plainToInstance } from 'class-transformer';
import { DetailedFinancialDto } from './dtos/detailed-financial.dto';
import { DailyFinancialDto } from './dtos/daily-financial.dto';
import { CompareFinancialDto } from './dtos/compare-financial.dto';

@Controller('financial-report')
@UsePipes(ValidationPipe)
export class FinancialReportController {
  constructor(
    private readonly financialReportService: FinancialReportService,
  ) {}

  @Get('/overview')
  async getOverview(
    @Query() filters: PeriodFilter,
  ): Promise<OverviewFinancialDto> {
    const overview = await this.financialReportService.getOverview(filters);
    return plainToInstance(OverviewFinancialDto, overview);
  }

  @Get('/detailed')
  async getDetailedReport(
    @Query() filters: PeriodFilter,
  ): Promise<DetailedFinancialDto> {
    const detailed = await this.financialReportService.getDetailed(filters);
    return plainToInstance(DetailedFinancialDto, detailed);
  }

  @Get('/daily')
  async getDaily(@Query() filters: PeriodFilter): Promise<DailyFinancialDto[]> {
    const daily = await this.financialReportService.getDaily(filters);
    return plainToInstance(DailyFinancialDto, daily);
  }

  @Get('/compare')
  async compareMonths(
    @Query() filters: MonthlyCompareFilter,
  ): Promise<CompareFinancialDto> {
    const result = await this.financialReportService.compareMonths(filters);
    return plainToInstance(CompareFinancialDto, result);
  }

  @Get('/pdf')
  async getPdf(@Query() filters: PeriodFilter, @Res() res: Response) {
    const pdf = await this.financialReportService.generatePdf(filters);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=relatorio-financeiro.pdf',
      'Content-Length': pdf.length,
    });

    res.end(pdf);
  }
}
