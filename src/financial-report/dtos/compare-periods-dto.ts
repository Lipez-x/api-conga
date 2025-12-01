import { IsString, Matches } from 'class-validator';

export class ComparePeriodsDto {
  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/)
  periodOne: string;

  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/)
  periodTwo: string;
}
