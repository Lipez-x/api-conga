import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplies } from './entities/supplies.entity';
import { Repository } from 'typeorm';
import { RegisterSuppliesDto } from './dtos/register-supplies.dto';

@Injectable()
export class SuppliesService {
  private logger = new Logger(SuppliesService.name);
  constructor(
    @InjectRepository(Supplies)
    private readonly suppliesRepository: Repository<Supplies>,
  ) {}
  async register(registerSuppliesDto: RegisterSuppliesDto) {
    try {
      const { quantity, unitPrice } = registerSuppliesDto;

      const totalCost = quantity * unitPrice;

      const supply = this.suppliesRepository.create({
        ...registerSuppliesDto,
        totalCost: totalCost,
      });

      return await this.suppliesRepository.save(supply);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
