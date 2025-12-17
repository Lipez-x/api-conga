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
import { SuppliesService } from './supplies.service';
import { RegisterSuppliesDto } from './dtos/register-supplies.dto';
import { FilterSuppliesDto } from './dtos/filter-supplies.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { UpdateSuppliesDto } from './dtos/update-supplies.dto';
import { paginatedResponse } from 'src/common/helpers/paginated-response';
import { SuppliesResponseDto } from './dtos/supplies-response.dto';
import { plainToInstance } from 'class-transformer';

@Roles(UserRole.ADMIN)
@Controller('supplies')
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(
    @Body() registerSuppliesDto: RegisterSuppliesDto,
  ): Promise<void> {
    return await this.suppliesService.register(registerSuppliesDto);
  }

  @Get()
  @UsePipes(ValidationPipe)
  async findAll(
    @Query() filters: FilterSuppliesDto,
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: SuppliesResponseDto[];
  }> {
    const result = await this.suppliesService.findAll(filters);
    return paginatedResponse(result, SuppliesResponseDto);
  }

  @Get('/:id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<SuppliesResponseDto> {
    const supply = await this.suppliesService.findById(id);
    return plainToInstance(SuppliesResponseDto, supply);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateSuppliesDto: UpdateSuppliesDto,
  ): Promise<{ message: string }> {
    return await this.suppliesService.update(id, updateSuppliesDto);
  }

  @Delete('/:id')
  async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ message: string }> {
    return await this.suppliesService.delete(id);
  }
}
