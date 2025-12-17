import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SalePriceService } from './sale-price.service';
import { NewSalePriceDto } from './dtos/new-sale-price.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { plainToInstance } from 'class-transformer';
import { SalePriceResponseDto } from './dtos/sale-price-response.dto';

@Roles(UserRole.ADMIN)
@Controller('sale-price')
export class SalePriceController {
  constructor(private readonly salePriceService: SalePriceService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async save(
    @Body() newSalePriceDto: NewSalePriceDto,
  ): Promise<{ message: string }> {
    return await this.salePriceService.save(newSalePriceDto);
  }

  @Get('/current')
  async getCurrent() {
    const current = await this.salePriceService.getByDate(new Date());
    return plainToInstance(SalePriceResponseDto, current);
  }
}
