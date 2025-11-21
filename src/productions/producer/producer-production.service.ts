import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RegisterProducerProductionDto } from './dtos/register-producer-production.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProducerProduction } from './entities/producer-production.entity';
import { Repository } from 'typeorm';
import { FilterProducerProductionDto } from './dtos/filter-producer-production.dto';
import { ReceivesService } from 'src/receives/receives.service';
import { UpdateProducerProductionDto } from './dtos/update-producer-production.dto';

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

      await this.producerProductionRepository.save(production);

      receive.producerProductions.push(production);
      await this.receivesService.recalculateAndSave(receive);
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

  async findById(id: string) {
    try {
      const producerProduction =
        await this.producerProductionRepository.findOne({
          where: { id },
        });

      if (!producerProduction) {
        throw new NotFoundException(
          `Produção de produtor com id ${id} não encontrada`,
        );
      }

      return producerProduction;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: string,
    updateProducerProductionDto: UpdateProducerProductionDto,
  ) {
    try {
      const producerProduction =
        await this.producerProductionRepository.findOne({
          where: { id },
          relations: ['receive'],
        });

      if (!producerProduction) {
        throw new NotFoundException(
          `Produção de produtor com id ${id} não encontrada`,
        );
      }

      const date = producerProduction.date;
      Object.assign(producerProduction, updateProducerProductionDto);

      await this.producerProductionRepository.save(producerProduction);

      const receive = await this.receivesService.replaceProducerProduction(
        date,
        producerProduction,
        updateProducerProductionDto.date,
      );

      await this.receivesService.recalculateAndSave(receive);
      return {
        message: `Produção de produtor id(${id}) atualizado com sucesso`,
      };
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string) {
    try {
      const producerProduction =
        await this.producerProductionRepository.findOne({
          where: { id },
          relations: [
            'receive',
            'receive.localProductions',
            'receive.producerProductions',
          ],
        });

      if (!producerProduction) {
        throw new NotFoundException(
          `Produção local de id ${id} não encontrada`,
        );
      }

      const receive = producerProduction.receive;
      await this.receivesService.removeProducerProduction(
        receive,
        producerProduction,
      );
      await this.producerProductionRepository.delete(producerProduction.id);
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
