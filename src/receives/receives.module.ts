import { Module } from '@nestjs/common';
import { ReceivesService } from './receives.service';
import { ReceivesController } from './receives.controller';

@Module({
  controllers: [ReceivesController],
  providers: [ReceivesService],
})
export class ReceivesModule {}
