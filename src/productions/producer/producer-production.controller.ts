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
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { RegisterProducerProductionDto } from './dtos/register-producer-production.dto';
import { ProducerProductionService } from './producer-production.service';
import { FilterProducerProductionDto } from './dtos/filter-producer-production.dto';
import { UpdateProducerProductionDto } from './dtos/update-producer-production.dto';
import { paginatedResponse } from 'src/common/helpers/paginated-response';
import { ProducerProductionResponseDto } from './dtos/producer-production-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@UsePipes(ValidationPipe)
@Controller('productions/producer')
export class ProducerProductionController {
  constructor(
    private readonly producerProductionService: ProducerProductionService,
  ) {}

  @Roles(UserRole.ADMIN)
  @Post('/register')
  async register(
    @Body() dto: RegisterProducerProductionDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    return await this.producerProductionService.register(dto, user);
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
    data: ProducerProductionResponseDto[];
  }> {
    const result = await this.producerProductionService.findAll(filters, user);
    return paginatedResponse(result, ProducerProductionResponseDto);
  }

  @Roles(UserRole.ADMIN)
  @Put('/:id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProducerProductionDto,
  ): Promise<{ message: string }> {
    return await this.producerProductionService.update(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @Delete('/:id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return await this.producerProductionService.delete(id);
  }
}
