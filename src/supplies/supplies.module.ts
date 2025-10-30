import { Module } from '@nestjs/common';
import { SuppliesController } from './supplies.controller';
import { SuppliesService } from './supplies.service';

@Module({
  controllers: [SuppliesController],
  providers: [SuppliesService]
})
export class SuppliesModule {}
