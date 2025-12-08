import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReceivesService } from './receives.service';
import { ReceivesFilterDto } from './dtos/receives-filter.dto';
import { UpdateSalePriceDto } from './dtos/update-sale-price.dto';

@Controller('receives')
@UsePipes(ValidationPipe)
export class ReceivesController {
  constructor(private readonly receivesService: ReceivesService) {}

  @Get()
  async findAll(@Query() filters: ReceivesFilterDto) {
    return await this.receivesService.findAll(filters);
  }

  @Put('/update-price/:date')
  async updateSalePrice(
    @Param('date') date: Date,
    @Body() dto: UpdateSalePriceDto,
  ) {
    return await this.receivesService.updateSalePrice(date, dto.value);
  }
}
