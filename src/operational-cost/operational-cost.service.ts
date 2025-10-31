import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OperationalCost } from './entities/operational-cost.entity';
import { Repository } from 'typeorm';
import { RegisterOperationalCostDto } from './dtos/register-operational-cost.dto';

@Injectable()
export class OperationalCostService {
  private logger = new Logger(OperationalCostService.name);
  constructor(
    @InjectRepository(OperationalCost)
    private readonly operationalCostRepository: Repository<OperationalCost>,
  ) {}
  async register(registerOperationalCostDto: RegisterOperationalCostDto) {
    try {
      const operationalCost = this.operationalCostRepository.create({
        ...registerOperationalCostDto,
      });

      return await this.operationalCostRepository.save(operationalCost);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
