import { Module } from '@nestjs/common';
import { OperationalCostController } from './operational-cost.controller';
import { OperationalCostService } from './operational-cost.service';

@Module({
  controllers: [OperationalCostController],
  providers: [OperationalCostService],
})
export class OperationalCostModule {}
