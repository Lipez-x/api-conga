import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RegisterUtilityCostDto } from './dtos/register-utility-cost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilityCost } from './entities/utility-cost.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UtilityCostService {
  private logger = new Logger(UtilityCostService.name);
  constructor(
    @InjectRepository(UtilityCost)
    private readonly utilityCostRepository: Repository<UtilityCost>,
  ) {}

  async register(registerUtilityCostDto: RegisterUtilityCostDto) {
    try {
      const utilityCost = this.utilityCostRepository.create({
        ...registerUtilityCostDto,
      });

      return await this.utilityCostRepository.save(utilityCost);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
