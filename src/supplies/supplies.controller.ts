import { Body, Controller, Post } from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { RegisterSuppliesDto } from './dtos/register-supplies.dto';

@Controller('supplies')
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Post('/register')
  async register(@Body() registerSuppliesDto: RegisterSuppliesDto) {
    return await this.suppliesService.register(registerSuppliesDto);
  }
}
