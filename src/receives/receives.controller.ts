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
import { ReceivesResponseDto } from './dtos/receives-response.dto';

@Controller('receives')
@UsePipes(ValidationPipe)
export class ReceivesController {
  constructor(private readonly receivesService: ReceivesService) {}

  @Get()
  async findAll(@Query() filters: ReceivesFilterDto): Promise<{
    average: number;
    monthly: number;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: ReceivesResponseDto[];
  }> {
    return await this.receivesService.findAll(filters);
  }

  @Put('/update-price/:date')
  async updateSalePrice(
    @Param('date') date: Date,
    @Body() dto: UpdateSalePriceDto,
  ): Promise<void> {
    return await this.receivesService.updateSalePrice(date, dto.value);
  }
}
