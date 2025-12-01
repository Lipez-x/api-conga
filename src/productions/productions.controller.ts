import { Controller, Get, Query } from '@nestjs/common';
import { ProductionsService } from './productions.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { filter } from 'rxjs';
import { GetDailyProductionDto } from './dtos/get-daily-production.dto';

@Roles(UserRole.ADMIN)
@Controller('productions')
export class ProductionsController {
  constructor(private readonly productionsService: ProductionsService) {}
  @Get('/daily')
  async getDailyProduction(@Query() filters: GetDailyProductionDto) {
    return await this.productionsService.getDaily(filters);
  }

  @Get('/monthly')
  async getGroupedByMonth() {
    return await this.productionsService.getGroupedByMonth();
  }
}
