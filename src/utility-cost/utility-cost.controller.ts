import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterUtilityCostDto } from './dtos/register-utility-cost.dto';
import { UtilityCostService } from './utility-cost.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';

@Roles(UserRole.ADMIN)
@Controller('utility-cost')
export class UtilityCostController {
  constructor(private readonly utilityCostService: UtilityCostService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Body() registerUtilityCostDto: RegisterUtilityCostDto) {
    return await this.utilityCostService.register(registerUtilityCostDto);
  }
}
