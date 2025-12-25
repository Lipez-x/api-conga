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
import { UpdateProducerProductionDto } from './dtos/update-producer-production.dto';
import { paginatedResponse } from 'src/common/helpers/paginated-response';
import { ProducerProductionRequestResponseDto } from './dtos/producer-production-request-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('productions/producer/requests')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class ProducerProductionRequestController {
  constructor(
    private readonly producerProductionRequestService: ProducerProductionRequestService,
  ) {}

  @Post('/register')
  async register(
    @Body() dto: RegisterProducerProductionDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    return await this.producerProductionRequestService.register(dto, user);
  }

  @Get()
  async findAll(
    @Query() filters: FilterProducerProductionDto,
    @CurrentUser() user: User,
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: ProducerProductionRequestResponseDto[];
  }> {
    const result = await this.producerProductionRequestService.findAll(
      filters,
      user,
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
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProducerProductionDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    return await this.producerProductionRequestService.update(id, dto, user);
  }

  @Delete('/:id')
  async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    return await this.producerProductionRequestService.delete(id, user);
  }
}
