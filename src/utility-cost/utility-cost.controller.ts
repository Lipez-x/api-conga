import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterUtilityCostDto } from './dtos/register-utility-cost.dto';
import { UtilityCostService } from './utility-cost.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { UtilityCostFilterDto } from './dtos/utility-cost-filter.dto';

@Roles(UserRole.ADMIN)
@Controller('utility-cost')
export class UtilityCostController {
  constructor(private readonly utilityCostService: UtilityCostService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Body() registerUtilityCostDto: RegisterUtilityCostDto) {
    return await this.utilityCostService.register(registerUtilityCostDto);
  }

  @Get()
  @UsePipes(ValidationPipe)
  async findAll(@Query() filters: UtilityCostFilterDto) {
    return await this.utilityCostService.findAll(filters);
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  async findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.utilityCostService.findById(id);
  }
}
