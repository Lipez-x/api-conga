import { Expose, Type } from 'class-transformer';
import { OverviewDto } from './overview-dto';

export class CompareMonthsDto {
  @Expose()
  @Type(() => OverviewDto)
  monthOneData: OverviewDto;

  @Expose()
  @Type(() => OverviewDto)
  monthTwoData: OverviewDto;
}
