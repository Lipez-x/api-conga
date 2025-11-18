import { Module } from '@nestjs/common';
import { SalePriceService } from './sale-price.service';
import { SalePriceController } from './sale-price.controller';
import { SalePrice } from './entities/sale-price-entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SalePrice])],
  controllers: [SalePriceController],
  providers: [SalePriceService],
  exports: [SalePriceService],
})
export class SalePriceModule {}
