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
import { LocalProductionService } from './local-production.service';
import { RegisterLocalProductionDto } from './dtos/register-local-production.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { FilterLocalProductionDto } from './dtos/filter-local-production.dto';
import { UpdateLocalProductionDto } from './dtos/update-local-production.dto';
import { LocalProductionPeriodFilter } from './dtos/filter-period-local-production.dto';
import { paginatedResponse } from 'src/common/helpers/paginated-response';
import { LocalProductionResponseDto } from './dtos/local-production-response.dto';

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
  ): Promise<void> {
    return await this.localProductionService.register(
      registerLocalProductionDto,
    );
  }

  @Get()
  async findAll(@Query() filters: FilterLocalProductionDto): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: LocalProductionResponseDto[];
  }> {
    const result = await this.localProductionService.findAll(filters);
    return paginatedResponse(result, LocalProductionResponseDto);
  }

  @Put('/:id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateLocalProductionDto: UpdateLocalProductionDto,
  ): Promise<{ message: string }> {
    return await this.localProductionService.update(
      id,
      updateLocalProductionDto,
    );
  }

  @Delete('/:id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return await this.localProductionService.delete(id);
  }

  @Get('/grouped')
  async getGrouped(
    @Query() filters: LocalProductionPeriodFilter,
  ): Promise<any[]> {
    return await this.localProductionService.getGrouped(filters);
  }
}
