import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductionService } from './production.service';
import { RegisterProductionDto } from './dtos/register-production.dto';

@UsePipes(ValidationPipe)
@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Post('/register')
  async register(@Body() registerProductionDto: RegisterProductionDto) {
    return await this.productionService.register(registerProductionDto);
  }
}
