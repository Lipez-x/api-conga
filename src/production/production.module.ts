import { Module } from '@nestjs/common';
import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';
import { LocalProduction } from './entities/local-production.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LocalProduction])],
  controllers: [ProductionController],
  providers: [ProductionService],
})
export class ProductionModule {}
