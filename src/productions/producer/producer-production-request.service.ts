import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProducerProductionRequest } from './entities/producer-production-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProducerProductionService } from './producer-production.service';
import { RegisterProducerProductionDto } from './dtos/register-producer-production.dto';
import { RequestStatus } from './enums/request-status.enum';
import { FilterProducerProductionDto } from './dtos/filter-producer-production.dto';
import { UpdateProducerProductionDto } from './dtos/update-producer-production.dto';

@Injectable()
export class ProducerProductionRequestService {
  private logger = new Logger(ProducerProductionRequestService.name);

  constructor(
    @InjectRepository(ProducerProductionRequest)
    private readonly producerProductionRequestRepository: Repository<ProducerProductionRequest>,
    private readonly producerProductionService: ProducerProductionService,
  ) {}

  async register(registerProducerProductionDto: RegisterProducerProductionDto) {
    try {
      const date = new Date(registerProducerProductionDto.date);

      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() - 8);

      if (date > limitDate) {
        return await this.producerProductionService.register(
          registerProducerProductionDto,
        );
      }

      const request = this.producerProductionRequestRepository.create({
        ...registerProducerProductionDto,
        status: RequestStatus.PENDING,
      });

      await this.producerProductionRequestRepository.save(request);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async validate(id: string) {
    try {
      const request = await this.producerProductionRequestRepository.findOne({
        where: { id },
      });

      if (!request) {
        throw new NotFoundException(
          `Solicitação de registro de produção de produtor com id ${id} não encontrada`,
        );
      }

      const producerProduction: RegisterProducerProductionDto = {
        date: request.date,
        producerName: request.producerName,
        totalQuantity: request.totalQuantity,
      };

      request.status = RequestStatus.ACCEPTED;

      await this.producerProductionService.register(producerProduction);
      await this.producerProductionRequestRepository.save(request);
      await this.producerProductionRequestRepository.softDelete(request.id);
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async unvalidate(id: string) {
    try {
      const request = await this.producerProductionRequestRepository.findOne({
        where: { id },
      });

      if (!request) {
        throw new NotFoundException(
          `Solicitação de registro de produção de produtor com id ${id} não encontrada`,
        );
      }

      request.status = RequestStatus.REJECTED;
      await this.producerProductionRequestRepository.save(request);
      await this.producerProductionRequestRepository.softDelete(request.id);
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(filters: FilterProducerProductionDto, status: RequestStatus) {
    const {
      dateFrom,
      dateTo,
      producerName,
      totalQuantityMin,
      totalQuantityMax,
      page = 1,
      limit = 10,
    } = filters;

    const query = this.producerProductionRequestRepository
      .createQueryBuilder('request')
      .withDeleted()
      .orderBy('request.date', 'DESC');

    if (status) query.andWhere('request.status = :status', { status });
    if (dateFrom) query.andWhere('request.date >= :dateFrom', { dateFrom });
    if (dateTo) query.andWhere('request.date <= :dateTo', { dateTo });
    if (producerName)
      query.andWhere('request.producer_name ILIKE :producerName', {
        producerName: `%${producerName}%`,
      });
    if (totalQuantityMin)
      query.andWhere('request.total_quantity >= :totalQuantityMin', {
        totalQuantityMin,
      });
    if (totalQuantityMax)
      query.andWhere('request.total_quantity <= :totalQuantityMax', {
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

  async update(
    id: string,
    updateProducerProductionDto: UpdateProducerProductionDto,
  ) {
    try {
      const request = await this.producerProductionRequestRepository.preload({
        id,
        ...updateProducerProductionDto,
      });

      if (!request) {
        throw new NotFoundException(
          `Solicitação de registro de produção de produtor com id ${id} não encontrada`,
        );
      }

      await this.producerProductionRequestRepository.save(request);
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
      const request = await this.producerProductionRequestRepository.findOne({
        where: { id },
      });

      if (!request) {
        throw new NotFoundException(
          `Produção local de id ${id} não encontrada`,
        );
      }

      await this.producerProductionRequestRepository.delete(request.id);
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
