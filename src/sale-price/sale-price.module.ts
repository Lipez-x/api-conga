import { Module } from '@nestjs/common';
import { SalePriceService } from './sale-price.service';
import { SalePriceController } from './sale-price.controller';

@Module({
  controllers: [SalePriceController],
  providers: [SalePriceService],
})
export class SalePriceModule {}
