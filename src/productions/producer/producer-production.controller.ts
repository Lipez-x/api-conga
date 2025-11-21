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
    return await this.producerProductionService.requestRegister(
      registerProducerProductionDto,
    );
  }

  @Roles(UserRole.ADMIN)
  @Put('requests/validate/:id')
  async validateRequest(
    @Query('validated', new ParseBoolPipe()) validated: boolean,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    if (!validated)
      return await this.producerProductionService.unvalidateRequest(id);

    return await this.producerProductionService.validateRequest(id);
  }

  @Get()
  async findAll(@Query() filters: FilterProducerProductionDto) {
    return await this.producerProductionService.findAll(filters);
  }

  @Get('/requests')
  async findAllRequests(
    @Query() filters: FilterProducerProductionDto,
    @Query('status') status: RequestStatus,
  ) {
    return await this.producerProductionService.findAllRequests(
      filters,
      status,
    );
  }

  @Put('/requests/:id')
  async updateRequest(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProducerProductionDto: UpdateProducerProductionDto,
  ) {
    return await this.producerProductionService.updateRequest(
      id,
      updateProducerProductionDto,
    );
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

  @Delete('/:id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.producerProductionService.delete(id);
  }
}
