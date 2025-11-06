import { Module } from '@nestjs/common';
import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';

@Module({
  controllers: [ProductionController],
  providers: [ProductionService],
})
export class ProductionModule {}
