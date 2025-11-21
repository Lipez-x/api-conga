import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReceivesService } from './receives.service';
import { ReceivesFilterDto } from './dtos/receives-filter.dto';

@Controller('receives')
@UsePipes(ValidationPipe)
export class ReceivesController {
  constructor(private readonly receivesService: ReceivesService) {}

  @Get()
  async findAll(@Query() filters: ReceivesFilterDto) {
    return this.receivesService.findAll(filters);
  }
}
