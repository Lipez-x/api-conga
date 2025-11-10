import { Module } from '@nestjs/common';
import { LocalProductionService } from './local/local-production.service';
import { LocalProductionController } from './local/local-production.controller';
import { LocalProduction } from './local/entities/local-production.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducerProductionController } from './producer/producer-production.controller';
import { ProducerProductionService } from './producer/producer-production.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocalProduction])],
  controllers: [LocalProductionController, ProducerProductionController],
  providers: [LocalProductionService, ProducerProductionService],
})
export class ProductionsModule {}
