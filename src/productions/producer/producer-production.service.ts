import {
  BadRequestException,
  HttpException,
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
import { applyPeriodFilter } from 'src/common/helpers/apply-period-filters';
import { paginate } from 'src/common/helpers/paginate';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/enums/user-role.enum';

@Injectable()
export class ProducerProductionService {
  private logger = new Logger(ProducerProductionService.name);

  constructor(
    @InjectRepository(ProducerProduction)
    private readonly producerProductionRepository: Repository<ProducerProduction>,
    private readonly receivesService: ReceivesService,
  ) {}

  async register(dto: RegisterProducerProductionDto, user: User) {
    try {
      const production = this.producerProductionRepository.create({
        ...dto,
        createdBy: user,
      });

      const receive = await this.receivesService.findOrCreate(dto.date);

      await this.producerProductionRepository.save(production);

      receive.producerProductions.push(production);
      await this.receivesService.recalculateAndSave(receive);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(filters: FilterProducerProductionDto, user: User) {
    const {
      producerName,
      totalQuantityMin,
      totalQuantityMax,
      page = 1,
      limit = 10,
    } = filters;

    const query = this.producerProductionRepository
      .createQueryBuilder('production')
      .orderBy('production.date', 'DESC');

    applyPeriodFilter(query, filters, { alias: 'production' });

    if (user.role === UserRole.COLLABORATOR) {
      query.andWhere('production.createdBy = :userId', { userId: user.id });
    }

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
      return await paginate(query, page, limit);
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

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async findLast() {
    try {
      const lastProduction = await this.producerProductionRepository
        .createQueryBuilder('production')
        .orderBy('date', 'DESC')
        .getOne();

      return lastProduction;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, dto: UpdateProducerProductionDto) {
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
      Object.assign(producerProduction, dto);

      await this.producerProductionRepository.save(producerProduction);

      const receive = await this.receivesService.replaceProducerProduction(
        date,
        producerProduction,
        dto.date,
      );

      await this.receivesService.recalculateAndSave(receive);
      return {
        message: `Produção de produtor id(${id}) atualizado com sucesso`,
      };
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

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async getTotal(filters: FilterProducerProductionDto) {
    const query = this.producerProductionRepository
      .createQueryBuilder('production')
      .leftJoinAndSelect('production.receive', 'receive');

    applyPeriodFilter(query, filters, { alias: 'production' });

    try {
      const producerReceive = await query
        .select('SUM(production.total_quantity * receive.sale_price)', 'total')
        .getRawOne();

      return Number(producerReceive.total);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
