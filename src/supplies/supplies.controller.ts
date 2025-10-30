import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { RegisterSuppliesDto } from './dtos/register-supplies.dto';
import { FilterSuppliesDto } from './dtos/filter-supplies.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';

@Roles(UserRole.ADMIN)
@Controller('supplies')
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Body() registerSuppliesDto: RegisterSuppliesDto) {
    return await this.suppliesService.register(registerSuppliesDto);
  }

  @Get()
  @UsePipes(ValidationPipe)
  async findAll(@Query() filters: FilterSuppliesDto) {
    return await this.suppliesService.findAll(filters);
  }

  @Get(':id')
  async findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.suppliesService.findById(id);
  }
}
