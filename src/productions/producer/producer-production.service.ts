import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RegisterProducerProductionDto } from './dtos/register-producer-production.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProducerProduction } from './entities/producer-production.entity';
import { Repository } from 'typeorm';
import { FilterProducerProductionDto } from './dtos/filter-producer-production.dto';
import { ReceivesService } from 'src/receives/receives.service';

@Injectable()
export class ProducerProductionService {
  private logger = new Logger(ProducerProductionService.name);

  constructor(
    @InjectRepository(ProducerProduction)
    private readonly producerProductionRepository: Repository<ProducerProduction>,
    private readonly receivesService: ReceivesService,
  ) {}

  async register(registerProducerProductionDto: RegisterProducerProductionDto) {
    try {
      const production = this.producerProductionRepository.create({
        ...registerProducerProductionDto,
      });

      const receive = await this.receivesService.findOrCreate(
        registerProducerProductionDto.date,
      );

      receive.producerProductions.push(production);

      await this.receivesService.save(receive);
      await this.producerProductionRepository.save(production);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(filters: FilterProducerProductionDto) {
    const {
      dateFrom,
      dateTo,
      producerName,
      totalQuantityMin,
      totalQuantityMax,
      page = 1,
      limit = 10,
    } = filters;

    const query =
      this.producerProductionRepository.createQueryBuilder('production');

    if (dateFrom) query.andWhere('production.date >= :dateFrom', { dateFrom });
    if (dateTo) query.andWhere('production.date <= :dateTo', { dateTo });
    if (producerName)
      query.andWhere('production.producer_name ILIKE :producerName', {
        producerName: `%${producerName}%`,
      });
    if (totalQuantityMin)
      query.andWhere('production.total_quantity >= :totalQuantityMin', {
        totalQuantityMin,
      });
    if (totalQuantityMax)
      query.andWhere('production.total_quantity <= :totalQuantityMax', {
        totalQuantityMax,
      });

    try {
      const [rows, total] = await query
        .skip((page - 1) * limit)
        .take(10)
        .getManyAndCount();

      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: rows,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
