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
import { PersonnelCostService } from './personnel-cost.service';
import { RegisterPersonnelCostDto } from './dtos/register-personnel-cost.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { PersonnelCostFilterDto } from './dtos/personnel-cost-filter.dto';
import { UpdatePersonnelCostDto } from './dtos/update-personnel-cost.dto';
import { paginatedResponse } from 'src/common/helpers/paginated-response';
import { PersonnelCostResponseDto } from './dtos/personnel-cost-response.dto';
import { plainToInstance } from 'class-transformer';

@Roles(UserRole.ADMIN)
@UsePipes(ValidationPipe)
@Controller('personnel-cost')
export class PersonnelCostController {
  constructor(private readonly personnelCostService: PersonnelCostService) {}

  @Post('/register')
  async register(@Body() dto: RegisterPersonnelCostDto): Promise<void> {
    return await this.personnelCostService.register(dto);
  }

  @Get()
  async findAll(@Query() filters: PersonnelCostFilterDto): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: PersonnelCostResponseDto[];
  }> {
    const result = await this.personnelCostService.findAll(filters);
    return paginatedResponse(result, PersonnelCostResponseDto);
  }

  @Get('/:id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<PersonnelCostResponseDto> {
    const cost = await this.personnelCostService.findById(id);
    return plainToInstance(PersonnelCostResponseDto, cost);
  }

  @Put('/:id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePersonnelCostDto,
  ): Promise<{ message: string }> {
    return await this.personnelCostService.update(id, dto);
  }

  @Delete('/:id')
  async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<{ message: string }> {
    return await this.personnelCostService.delete(id);
  }
}
