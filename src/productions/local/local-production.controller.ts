import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LocalProductionService } from './local-production.service';
import { RegisterLocalProductionDto } from './dtos/register-local-production.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { FilterLocalProductionDto } from './dtos/filter-local-production.dto';

@Roles(UserRole.ADMIN)
@UsePipes(ValidationPipe)
@Controller('productions/local')
export class LocalProductionController {
  constructor(
    private readonly localProductionService: LocalProductionService,
  ) {}

  @Post('/register')
  async register(
    @Body() registerLocalProductionDto: RegisterLocalProductionDto,
  ) {
    return await this.localProductionService.register(
      registerLocalProductionDto,
    );
  }

  @Get()
  async findAll(@Query() filters: FilterLocalProductionDto) {
    return await this.localProductionService.findAll(filters);
  }
}
