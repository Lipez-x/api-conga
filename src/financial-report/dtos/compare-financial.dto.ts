import { Expose, Type } from 'class-transformer';
import { OverviewFinancialDto } from './overview-financial.dto';

export class CompareFinancialDto {
  @Expose()
  @Type(() => OverviewFinancialDto)
  monthOneData: OverviewFinancialDto;

  @Expose()
  @Type(() => OverviewFinancialDto)
  monthTwoData: OverviewFinancialDto;
}
