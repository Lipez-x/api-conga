import { Controller, Get, Query } from '@nestjs/common';
import { ProductionsService } from './productions.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { GetDailyProductionDto } from './dtos/get-daily-production.dto';
import { plainToInstance } from 'class-transformer';
import { GetGroupedProductionDto } from './dtos/get-grouped-production.dto';
import { paginatedResponse } from 'src/common/helpers/paginated-response';
import { GetDailyProductionResponseDto } from './dtos/get-daily-production-response.dto';

@Roles(UserRole.ADMIN)
@Controller('productions')
export class ProductionsController {
  constructor(private readonly productionsService: ProductionsService) {}
  @Get('/daily')
  async getDailyProduction(@Query() filters: GetDailyProductionDto): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: GetDailyProductionResponseDto[];
  }> {
    const result = await this.productionsService.getDaily(filters);
    return paginatedResponse(result, GetDailyProductionResponseDto);
  }

  @Get('/monthly')
  async getGroupedByMonth(): Promise<GetGroupedProductionDto[]> {
    const grouped = await this.productionsService.getGroupedByMonth();
    return plainToInstance(GetGroupedProductionDto, grouped);
  }
}
