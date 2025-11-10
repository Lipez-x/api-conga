import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductionService } from './production.service';
import { RegisterProductionDto } from './dtos/register-production.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { FilterProductionDto } from './dtos/filter-production.dtos';

@Roles(UserRole.ADMIN)
@UsePipes(ValidationPipe)
@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Post('/register')
  async register(@Body() registerProductionDto: RegisterProductionDto) {
    return await this.productionService.register(registerProductionDto);
  }

  @Get()
  async findAll(@Query() filters: FilterProductionDto) {
    return await this.productionService.findAll(filters);
  }
}
