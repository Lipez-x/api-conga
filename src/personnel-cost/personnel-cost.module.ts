import { Module } from '@nestjs/common';
import { PersonnelCostService } from './personnel-cost.service';
import { PersonnelCostController } from './personnel-cost.controller';

@Module({
  controllers: [PersonnelCostController],
  providers: [PersonnelCostService],
})
export class PersonnelCostModule {}
