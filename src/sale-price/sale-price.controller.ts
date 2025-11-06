import { Controller } from '@nestjs/common';
import { SalePriceService } from './sale-price.service';

@Controller('sale-price')
export class SalePriceController {
  constructor(private readonly salePriceService: SalePriceService) {}
}
