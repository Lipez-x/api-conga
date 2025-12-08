import { forwardRef, Module } from '@nestjs/common';
import { ReceivesService } from './receives.service';
import { ReceivesController } from './receives.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receive } from './entities/receive.entity';
import { SalePriceModule } from 'src/sale-price/sale-price.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Receive]),
    forwardRef(() => SalePriceModule),
  ],
  controllers: [ReceivesController],
  providers: [ReceivesService],
  exports: [ReceivesService],
})
export class ReceivesModule {}
