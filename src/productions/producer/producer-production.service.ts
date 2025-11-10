import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RegisterProducerProductionDto } from './dtos/register-producer-production.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProducerProduction } from './entities/producer-production.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProducerProductionService {
  private logger = new Logger(ProducerProductionService.name);

  constructor(
    @InjectRepository(ProducerProduction)
    private readonly producerProductionRepository: Repository<ProducerProduction>,
  ) {}

  async register(registerProducerProductionDto: RegisterProducerProductionDto) {
    try {
      const production = this.producerProductionRepository.create({
        ...registerProducerProductionDto,
      });

      return await this.producerProductionRepository.save(production);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
