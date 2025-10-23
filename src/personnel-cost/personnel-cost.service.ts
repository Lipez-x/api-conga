import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RegisterPersonnelCostDto } from './dtos/register-personnel-cost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonnelCost } from './entities/personnel-cost.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PersonnelCostService {
  private readonly logger = new Logger(PersonnelCostService.name);

  constructor(
    @InjectRepository(PersonnelCost)
    private readonly personnelCostRepository: Repository<PersonnelCost>,
  ) {}
  async register(registerPersonnelCostDto: RegisterPersonnelCostDto) {
    try {
      const personnelCost = this.personnelCostRepository.create({
        ...registerPersonnelCostDto,
      });

      return await this.personnelCostRepository.save(personnelCost);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
