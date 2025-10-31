import { Module } from '@nestjs/common';
import { OperationalCostController } from './operational-cost.controller';
import { OperationalCostService } from './operational-cost.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationalCost } from './entities/operational-cost.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OperationalCost])],
  controllers: [OperationalCostController],
  providers: [OperationalCostService],
  exports: [OperationalCostService],
})
export class OperationalCostModule {}
