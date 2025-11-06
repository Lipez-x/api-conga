import { Module } from '@nestjs/common';
import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';
import { Production } from './entities/production.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Production])],
  controllers: [ProductionController],
  providers: [ProductionService],
})
export class ProductionModule {}
