import { Module } from '@nestjs/common';
import { LocalProductionService } from './local/local-production.service';
import { LocalProductionController } from './local/local-production.controller';
import { LocalProduction } from './local/entities/local-production.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducerProductionController } from './producer/producer-production.controller';
import { ProducerProductionService } from './producer/producer-production.service';
import { ProducerProduction } from './producer/entities/producer-production.entity';
import { ProductionsController } from './productions.controller';
import { ProductionsService } from './productions.service';
import { ReceivesModule } from 'src/receives/receives.module';
import { ProducerProductionRequest } from './producer/entities/producer-production-request.entity';
import { ProducerProductionRequestService } from './producer/producer-production-request.service';
import { ProducerProductionRequestController } from './producer/producer-production-request.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LocalProduction,
      ProducerProduction,
      ProducerProductionRequest,
    ]),
    ReceivesModule,
  ],
  controllers: [
    LocalProductionController,
    ProducerProductionController,
    ProductionsController,
    ProducerProductionRequestController,
  ],
  providers: [
    LocalProductionService,
    ProducerProductionService,
    ProductionsService,
    ProducerProductionRequestService,
  ],
  exports: [ProductionsService, ProducerProductionService],
})
export class ProductionsModule {}
