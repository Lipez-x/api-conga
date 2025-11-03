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
import { PersonnelCostService } from './personnel-cost.service';
import { RegisterPersonnelCostDto } from './dtos/register-personnel-cost.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { PersonnelCostFilterDto } from './dtos/personnel-cost-filter.dto';
import { UpdatePersonnelCostDto } from './dtos/update-personnel-cost.dto';

@Roles(UserRole.ADMIN)
@UsePipes(ValidationPipe)
@Controller('personnel-cost')
export class PersonnelCostController {
  constructor(private readonly personnelCostService: PersonnelCostService) {}

  @Post('/register')
  async register(@Body() registerPersonnelCostDto: RegisterPersonnelCostDto) {
    return await this.personnelCostService.register(registerPersonnelCostDto);
  }

  @Get()
  async findAll(@Query() filters: PersonnelCostFilterDto) {
    return await this.personnelCostService.findAll(filters);
  }

  @Get(':id')
  async findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.personnelCostService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePersonnelCostDto: UpdatePersonnelCostDto,
  ) {
    return await this.personnelCostService.update(id, updatePersonnelCostDto);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.personnelCostService.delete(id);
  }
}
