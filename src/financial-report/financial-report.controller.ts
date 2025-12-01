import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FinancialReportFilterDto } from './dtos/financial-report-filter.dto';
import { FinancialReportService } from './financial-report.service';

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
}
