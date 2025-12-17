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
import { OperationalCostService } from './operational-cost.service';
import { RegisterOperationalCostDto } from './dtos/register-operational-cost.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { OperationalCostFilterDto } from './dtos/operational-cost-filter.dto';
import { UpdateOperationalCostDto } from './dtos/update-operational-cost.dto';
import { paginatedResponse } from 'src/common/helpers/paginated-response';
import { OperationalCostResponseDto } from './dtos/operational-cost-response.dto';
import { plainToInstance } from 'class-transformer';

@Roles(UserRole.ADMIN)
@Controller('operational-cost')
export class OperationalCostController {
  constructor(
    private readonly operationalCostService: OperationalCostService,
  ) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(
    @Body() registerOperationalCostDto: RegisterOperationalCostDto,
  ): Promise<void> {
    return await this.operationalCostService.register(
      registerOperationalCostDto,
    );
  }

  @Get()
  @UsePipes(ValidationPipe)
  async findAll(@Query() filters: OperationalCostFilterDto): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: OperationalCostResponseDto[];
  }> {
    const result = await this.operationalCostService.findAll(filters);
    return paginatedResponse(result, OperationalCostResponseDto);
  }

  @Get('/:id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<OperationalCostResponseDto> {
    const operationalCost = await this.operationalCostService.findById(id);
    return plainToInstance(OperationalCostResponseDto, operationalCost);
  }

  @Put('/:id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOperationalCostDto: UpdateOperationalCostDto,
  ): Promise<{ message: string }> {
    return await this.operationalCostService.update(
      id,
      updateOperationalCostDto,
    );
  }

  @Delete('/:id')
  async delet(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ message: string }> {
    return await this.operationalCostService.delete(id);
  }
}
