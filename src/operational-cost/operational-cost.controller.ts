import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OperationalCostService } from './operational-cost.service';
import { RegisterOperationalCostDto } from './dtos/register-operational-cost.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';

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
}
