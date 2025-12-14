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
import { OverviewDto } from './dtos/overview-dto';
import { plainToInstance } from 'class-transformer';
import { DetailedDto } from './dtos/detailed-dto';
import { DailyDto } from './dtos/daily-dto';
import { CompareMonthsDto } from './dtos/compare-months.dto';

@Controller('financial-report')
@UsePipes(ValidationPipe)
export class FinancialReportController {
  constructor(
    private readonly financialReportService: FinancialReportService,
  ) {}

  @Get('/overview')
  async getOverview(@Query() filters: PeriodFilter): Promise<OverviewDto> {
    const overview = await this.financialReportService.getOverview(filters);
    return plainToInstance(OverviewDto, overview);
  }

  @Get('/detailed')
  async getDetailedReport(
    @Query() filters: PeriodFilter,
  ): Promise<DetailedDto> {
    const detailed = await this.financialReportService.getDetailed(filters);
    return plainToInstance(DetailedDto, detailed);
  }

  @Get('/daily')
  async getDaily(@Query() filters: PeriodFilter): Promise<DailyDto[]> {
    const daily = await this.financialReportService.getDaily(filters);
    return plainToInstance(DailyDto, daily);
  }

  @Get('/compare')
  async compareMonths(
    @Query() filters: MonthlyCompareFilter,
  ): Promise<CompareMonthsDto> {
    const result = await this.financialReportService.compareMonths(filters);
    return plainToInstance(CompareMonthsDto, result);
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
