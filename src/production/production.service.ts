import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RegisterProductionDto } from './dtos/register-production.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Production } from './entities/production.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductionService {
  private logger = new Logger(ProductionService.name);

  constructor(
    @InjectRepository(Production)
    private readonly productionRepository: Repository<Production>,
  ) {}

  async register(registerProductionDto: RegisterProductionDto) {
    try {
      const production = this.productionRepository.create({
        ...registerProductionDto,
      });

      return await this.productionRepository.save(production);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
