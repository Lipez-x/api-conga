import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterUtilityCostDto } from './dtos/register-utility-cost.dto';
import { UtilityCostService } from './utility-cost.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { UtilityCostFilterDto } from './dtos/utility-cost-filter.dto';
import { UpdateUtilityCostDto } from './dtos/update-utility-cost.dto';

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
  async findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.utilityCostService.findById(id);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUtilityCostDto: UpdateUtilityCostDto,
  ) {
    return await this.utilityCostService.update(id, updateUtilityCostDto);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.utilityCostService.delete(id);
  }
}
