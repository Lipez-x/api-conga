import { Module } from '@nestjs/common';
import { UtilityCostController } from './utility-cost.controller';
import { UtilityCostService } from './utility-cost.service';

@Module({
  controllers: [UtilityCostController],
  providers: [UtilityCostService]
})
export class UtilityCostModule {}
