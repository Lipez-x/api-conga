import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
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
import { RequestStatus } from './enums/request-status.enum';
import { ProducerProductionRequestService } from './producer-production-request.service';
import { User } from 'src/users/entities/user.entity';

@UsePipes(ValidationPipe)
@Controller('productions/producer')
export class ProducerProductionController {
  constructor(
    private readonly producerProductionService: ProducerProductionService,
    private readonly producerProductionRequestService: ProducerProductionRequestService,
  ) {}

  @Roles(UserRole.ADMIN)
  @Post('/register')
  async register(
    @Body() registerProducerProductionDto: RegisterProducerProductionDto,
  ) {
    return await this.producerProductionRequestService.register(
      registerProducerProductionDto,
    );
  }

  @Get()
  async findAll(@Query() filters: FilterProducerProductionDto) {
    return await this.producerProductionService.findAll(filters);
  }

  @Roles(UserRole.ADMIN)
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

  @Roles(UserRole.ADMIN)
  @Delete('/:id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.producerProductionService.delete(id);
  }
}
