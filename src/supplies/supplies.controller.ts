import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { RegisterSuppliesDto } from './dtos/register-supplies.dto';
import { FilterSuppliesDto } from './dtos/filter-supplies.dto';

@Controller('supplies')
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Body() registerSuppliesDto: RegisterSuppliesDto) {
    return await this.suppliesService.register(registerSuppliesDto);
  }

  @Get()
  @UsePipes(ValidationPipe)
  async findAll(@Query() filters: FilterSuppliesDto) {
    return await this.suppliesService.findAll(filters);
  }
}
