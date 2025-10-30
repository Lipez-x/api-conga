import { Module } from '@nestjs/common';
import { SuppliesController } from './supplies.controller';
import { SuppliesService } from './supplies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplies } from './entities/supplies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplies])],
  controllers: [SuppliesController],
  providers: [SuppliesService],
})
export class SuppliesModule {}
