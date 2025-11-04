import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OperationalCostService } from './operational-cost.service';
import { RegisterOperationalCostDto } from './dtos/register-operational-cost.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { OperationalCostFilterDto } from './dtos/operational-cost-filter.dto';
import { UpdateOperationalCostDto } from './dtos/update-operational-cost.dto';

@Roles(UserRole.ADMIN)
@Controller('operational-cost')
export class OperationalCostController {
  constructor(
    private readonly operationalCostService: OperationalCostService,
  ) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(
    @Body() registerOperationalCostDto: RegisterOperationalCostDto,
  ) {
    return await this.operationalCostService.register(
      registerOperationalCostDto,
    );
  }

  @Get()
  @UsePipes(ValidationPipe)
  async findAll(@Query() filters: OperationalCostFilterDto) {
    return await this.operationalCostService.findAll(filters);
  }

  @Get(':id')
  async findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.operationalCostService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOperationalCostDto: UpdateOperationalCostDto,
  ) {
    return await this.operationalCostService.update(
      id,
      updateOperationalCostDto,
    );
  }

  @Delete(':id')
  async delet(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.operationalCostService.delete(id);
  }
}
