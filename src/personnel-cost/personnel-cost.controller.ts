import { Controller } from '@nestjs/common';
import { PersonnelCostService } from './personnel-cost.service';

@Controller('personnel-cost')
export class PersonnelCostController {
  constructor(private readonly personnelCostService: PersonnelCostService) {}
}
