import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PersonnelCostService } from './personnel-cost.service';
import { RegisterPersonnelCostDto } from './dtos/register-personnel-cost.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { PersonnelCostFilterDto } from './dtos/personnel-cost-filter.dto';

@Roles(UserRole.ADMIN)
@Controller('personnel-cost')
export class PersonnelCostController {
  constructor(private readonly personnelCostService: PersonnelCostService) {}

  @Post('/register')
  async register(@Body() registerPersonnelCostDto: RegisterPersonnelCostDto) {
    return await this.personnelCostService.register(registerPersonnelCostDto);
  }

  @Get()
  @UsePipes(ValidationPipe)
  async findAll(@Query() filters: PersonnelCostFilterDto) {
    return await this.personnelCostService.findAll(filters);
  }
}
