import { Module } from '@nestjs/common';
import { LocalProductionService } from './local/local-production.service';
import { LocalProductionController } from './local/local-production.controller';
import { LocalProduction } from './local/entities/local-production.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LocalProduction])],
  controllers: [LocalProductionController],
  providers: [LocalProductionService],
})
export class ProductionsModule {}
