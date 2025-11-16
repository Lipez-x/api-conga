import { Controller } from '@nestjs/common';
import { ReceivesService } from './receives.service';

@Controller('receives')
export class ReceivesController {
  constructor(private readonly receivesService: ReceivesService) {}
}
