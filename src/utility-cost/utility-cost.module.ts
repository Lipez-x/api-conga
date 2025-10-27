import { Module } from '@nestjs/common';
import { UtilityCostController } from './utility-cost.controller';
import { UtilityCostService } from './utility-cost.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilityCost } from './entities/utility-cost.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UtilityCost])],
  controllers: [UtilityCostController],
  providers: [UtilityCostService],
})
export class UtilityCostModule {}
