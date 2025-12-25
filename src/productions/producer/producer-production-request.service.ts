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
import { applyPeriodFilter } from 'src/common/helpers/apply-period-filters';
import { paginate } from 'src/common/helpers/paginate';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/enums/user-role.enum';

@Injectable()
export class ProducerProductionRequestService {
  private logger = new Logger(ProducerProductionRequestService.name);

  constructor(
    @InjectRepository(ProducerProductionRequest)
    private readonly producerProductionRequestRepository: Repository<ProducerProductionRequest>,
    private readonly producerProductionService: ProducerProductionService,
  ) {}

  async register(dto: RegisterProducerProductionDto, user: User) {
    try {
      const date = new Date(dto.date);

      const now = new Date();

      const limitDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      limitDate.setDate(limitDate.getDate() - 1);

      if (date > limitDate) {
        return await this.producerProductionService.register(dto);
      }

      const request = this.producerProductionRequestRepository.create({
        ...dto,
        status: RequestStatus.PENDING,
        createdBy: user,
      });

      await this.producerProductionRequestRepository.save(request);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async validate(id: string) {
    return this.producerProductionRequestRepository.manager.transaction(
      async (manager) => {
        const request = await manager.findOne(ProducerProductionRequest, {
          where: { id },
        });

        if (!request) {
          throw new NotFoundException(
            `Solicitação de registro de produção de produtor com id ${id} não encontrada`,
          );
        }

        request.status = RequestStatus.ACCEPTED;

        await this.producerProductionService.register({
          date: request.date,
          producerName: request.producerName,
          totalQuantity: request.totalQuantity,
        });

        await manager.save(request);
        await manager.softDelete(ProducerProductionRequest, request.id);
      },
    );
  }

  async unvalidate(id: string) {
    return this.producerProductionRequestRepository.manager.transaction(
      async (manager) => {
        const request = await manager.findOne(ProducerProductionRequest, {
          where: { id },
        });

        if (!request) {
          throw new NotFoundException(
            `Solicitação de registro de produção de produtor com id ${id} não encontrada`,
          );
        }

        request.status = RequestStatus.REJECTED;

        await manager.save(request);
        await manager.softDelete(ProducerProductionRequest, request.id);
      },
    );
  }

  async findAll(filters: FilterProducerProductionDto, user: User) {
    const {
      producerName,
      totalQuantityMin,
      totalQuantityMax,
      status,
      page = 1,
      limit = 10,
    } = filters;

    const query = this.producerProductionRequestRepository
      .createQueryBuilder('request')
      .withDeleted()
      .orderBy('request.date', 'DESC');

    applyPeriodFilter(query, filters, { alias: 'request' });

    if (user.role === UserRole.COLLABORATOR) {
      query.andWhere('request.createdBy = :userId', { userId: user.id });
    }

    if (status) query.andWhere('request.status = :status', { status });
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
      return await paginate(query, page, limit);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, dto: UpdateProducerProductionDto) {
    try {
      const request = await this.producerProductionRequestRepository.preload({
        id,
        ...dto,
      });

      if (!request) {
        throw new NotFoundException(
          `Solicitação de registro de produção de produtor com id ${id} não encontrada`,
        );
      }

      await this.producerProductionRequestRepository.save(request);
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof HttpException) {
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

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
