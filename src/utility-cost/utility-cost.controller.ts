import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterUtilityCostDto } from './dtos/register-utility-cost.dto';
import { UtilityCostService } from './utility-cost.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { UtilityCostFilterDto } from './dtos/utility-cost-filter.dto';
import { UpdateUtilityCostDto } from './dtos/update-utility-cost.dto';
import { paginatedResponse } from 'src/common/helpers/paginated-response';
import { UtilityCostResponseDto } from './dtos/utility-cost-response.dto';
import { plainToInstance } from 'class-transformer';

@Roles(UserRole.ADMIN)
@UsePipes(ValidationPipe)
@Controller('utility-cost')
export class UtilityCostController {
  constructor(private readonly utilityCostService: UtilityCostService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Body() dto: RegisterUtilityCostDto) {
    return await this.utilityCostService.register(dto);
  }

  @Get()
  async findAll(@Query() filters: UtilityCostFilterDto): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: UtilityCostResponseDto[];
  }> {
    const result = await this.utilityCostService.findAll(filters);
    return paginatedResponse(result, UtilityCostResponseDto);
  }

  @Get('/:id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UtilityCostResponseDto> {
    const utilityCost = await this.utilityCostService.findById(id);
    return plainToInstance(UtilityCostResponseDto, utilityCost);
  }

  @Put('/:id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUtilityCostDto,
  ): Promise<{ message: string }> {
    return await this.utilityCostService.update(id, dto);
  }

  @Delete('/:id')
  async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ message: string }> {
    return await this.utilityCostService.delete(id);
  }
}
