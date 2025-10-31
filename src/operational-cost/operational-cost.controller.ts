import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OperationalCostService } from './operational-cost.service';
import { RegisterOperationalCostDto } from './dtos/register-operational-cost.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { OperationalCostFilterDto } from './dtos/operational-cost-filter.dto';

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
}
