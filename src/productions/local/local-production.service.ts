import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RegisterLocalProductionDto } from './dtos/register-local-production.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalProduction } from './entities/local-production.entity';
import { Repository } from 'typeorm';
import { FilterLocalProductionDto } from './dtos/filter-local-production.dto';
import { ReceivesService } from 'src/receives/receives.service';
import { UpdateLocalProductionDto } from './dtos/update-local-production.dto';
import { LocalProductionPeriodFilter } from './dtos/filter-period-local-production.dto';
import { applyPeriodFilter } from 'src/common/helpers/apply-period-filters';
import { paginate } from 'src/common/helpers/paginate';

@Injectable()
export class LocalProductionService {
  private logger = new Logger(LocalProduction.name);

  constructor(
    @InjectRepository(LocalProduction)
    private readonly localProductionRepository: Repository<LocalProduction>,
    private readonly receivesService: ReceivesService,
  ) {}

  async register(dto: RegisterLocalProductionDto) {
    try {
      const production = this.localProductionRepository.create({
        ...dto,
      });

      const receive = await this.receivesService.findOrCreate(dto.date);

      await this.localProductionRepository.save(production);

      receive.localProductions.push(production);
      await this.receivesService.recalculateAndSave(receive);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(filters: FilterLocalProductionDto) {
    const {
      grossQuantityMin,
      grossQuantityMax,
      consumedQuantityMin,
      consumedQuantityMax,
      totalQuantityMin,
      totalQuantityMax,
      page = 1,
      limit = 10,
    } = filters;

    const query = this.localProductionRepository
      .createQueryBuilder('production')
      .orderBy('production.date', 'DESC');

    applyPeriodFilter(query, filters, { alias: 'production' });

    if (grossQuantityMin)
      query.andWhere('production.gross_quantity >= :grossQuantityMin', {
        grossQuantityMin,
      });
    if (grossQuantityMax)
      query.andWhere('production.gross_quantity <= :grossQuantityMax', {
        grossQuantityMax,
      });
    if (consumedQuantityMin)
      query.andWhere('production.consumed_quantity >= :consumedQuantityMin', {
        consumedQuantityMin,
      });
    if (consumedQuantityMax)
      query.andWhere('production.consumed_quantity <= :consumedQuantityMax', {
        consumedQuantityMax,
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
      const localProduction = await this.localProductionRepository.findOne({
        where: { id },
      });

      if (!localProduction) {
        throw new NotFoundException(
          `Produção local de id ${id} não encontrada`,
        );
      }

      return localProduction;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, dto: UpdateLocalProductionDto) {
    try {
      const localProduction = await this.localProductionRepository.findOne({
        where: { id },
        relations: ['receive'],
      });

      if (!localProduction) {
        throw new NotFoundException(
          `Produção local de id ${id} não encontrada`,
        );
      }

      const date = localProduction.date;
      Object.assign(localProduction, dto);

      await this.localProductionRepository.save(localProduction);

      const receive = await this.receivesService.replaceLocalProduction(
        date,
        localProduction,
        dto.date,
      );

      await this.receivesService.recalculateAndSave(receive);
      return {
        message: `Produção local id(${id}) atualizado com sucesso`,
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
      const localProduction = await this.localProductionRepository.findOne({
        where: { id },
        relations: [
          'receive',
          'receive.localProductions',
          'receive.producerProductions',
        ],
      });

      if (!localProduction) {
        throw new NotFoundException(
          `Produção local de id ${id} não encontrada`,
        );
      }

      const receive = localProduction.receive;
      await this.receivesService.removeLocalProduction(
        receive,
        localProduction,
      );
      await this.localProductionRepository.delete(localProduction.id);
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async getGrouped(filters: LocalProductionPeriodFilter) {
    const query =
      this.localProductionRepository.createQueryBuilder('production');

    applyPeriodFilter(query, filters, { alias: 'production' });

    try {
      const result = await query
        .select('COALESCE(SUM(production.gross_quantity), 0)', 'grossQuantity')
        .addSelect('COALESCE(SUM(consumed_quantity), 0)', 'consumedQuantity')
        .addSelect(
          'COALESCE(SUM(production.total_quantity), 0)',
          'totalQuantity',
        )
        .getRawMany();

      return result;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getTotal(filters: FilterLocalProductionDto) {
    const query = this.localProductionRepository
      .createQueryBuilder('production')
      .leftJoinAndSelect('production.receive', 'receive');

    applyPeriodFilter(query, filters, { alias: 'production' });

    try {
      const localReceive = await query
        .select('SUM(production.total_quantity * receive.sale_price)', 'total')
        .getRawOne();

      return Number(localReceive.total);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
