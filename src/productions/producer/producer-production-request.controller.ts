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
import { ProducerProductionRequestService } from './producer-production-request.service';
import { RegisterProducerProductionDto } from './dtos/register-producer-production.dto';
import { FilterProducerProductionDto } from './dtos/filter-producer-production.dto';
import { RequestStatus } from './enums/request-status.enum';
import { UpdateProducerProductionDto } from './dtos/update-producer-production.dto';
import { paginatedResponse } from 'src/common/helpers/paginated-response';
import { ProducerProductionRequestResponseDto } from './dtos/producer-production-request-response.dto';

@Controller('productions/producer/requests')
@UsePipes(ValidationPipe)
export class ProducerProductionRequestController {
  constructor(
    private readonly producerProductionRequestService: ProducerProductionRequestService,
  ) {}

  @Post('/register')
  async register(
    @Body() registerProducerProductionDto: RegisterProducerProductionDto,
  ): Promise<void> {
    return await this.producerProductionRequestService.register(
      registerProducerProductionDto,
    );
  }

  @Get()
  async findAll(
    @Query() filters: FilterProducerProductionDto,
    @Query('status') status: RequestStatus,
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: ProducerProductionRequestResponseDto[];
  }> {
    const result = await this.producerProductionRequestService.findAll(
      filters,
      status,
    );

    return paginatedResponse(result, ProducerProductionRequestResponseDto);
  }

  @Roles(UserRole.ADMIN)
  @Put('/validate/:id')
  async validate(
    @Query('validated', new ParseBoolPipe()) validated: boolean,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    if (!validated)
      return await this.producerProductionRequestService.unvalidate(id);

    return await this.producerProductionRequestService.validate(id);
  }

  @Put('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProducerProductionDto: UpdateProducerProductionDto,
  ): Promise<void> {
    return await this.producerProductionRequestService.update(
      id,
      updateProducerProductionDto,
    );
  }

  @Delete('/:id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return await this.producerProductionRequestService.delete(id);
  }
}
