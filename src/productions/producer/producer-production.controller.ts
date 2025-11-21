import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { RegisterProducerProductionDto } from './dtos/register-producer-production.dto';
import { ProducerProductionService } from './producer-production.service';
import { FilterProducerProductionDto } from './dtos/filter-producer-production.dto';
import { UpdateProducerProductionDto } from './dtos/update-producer-production.dto';

@Roles(UserRole.COLLABORATOR)
@UsePipes(ValidationPipe)
@Controller('productions/producer')
export class ProducerProductionController {
  constructor(
    private readonly producerProductionService: ProducerProductionService,
  ) {}

  @Post('/register')
  async register(
    @Body() registerProducerProductionDto: RegisterProducerProductionDto,
  ) {
    return await this.producerProductionService.register(
      registerProducerProductionDto,
    );
  }

  @Get()
  async findAll(@Query() filters: FilterProducerProductionDto) {
    return await this.producerProductionService.findAll(filters);
  }

  @Put('/:id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProducerProductionDto: UpdateProducerProductionDto,
  ) {
    return await this.producerProductionService.update(
      id,
      updateProducerProductionDto,
    );
  }
}
