import {
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

@Injectable()
export class LocalProductionService {
  private logger = new Logger(LocalProduction.name);

  constructor(
    @InjectRepository(LocalProduction)
    private readonly localProductionRepository: Repository<LocalProduction>,
    private readonly receivesService: ReceivesService,
  ) {}

  async register(registerLocalProductionDto: RegisterLocalProductionDto) {
    try {
      const production = this.localProductionRepository.create({
        ...registerLocalProductionDto,
      });

      const receive = await this.receivesService.findOrCreate(
        registerLocalProductionDto.date,
      );

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
      dateFrom,
      dateTo,
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

    if (dateFrom) query.andWhere('production.date >= :dateFrom', { dateFrom });
    if (dateTo) query.andWhere('production.date <= :dateTo', { dateTo });
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
      const [rows, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      const data = rows.map((item) => ({
        id: item.id,
        date: item.date,
        grossQuantity: item.grossQuantity,
        consumedQuantity: item.consumedQuantity,
        totalQuantity: item.totalQuantity,
      }));

      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data,
      };
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

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateLocalProductionDto: UpdateLocalProductionDto) {
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
      Object.assign(localProduction, updateLocalProductionDto);

      await this.localProductionRepository.save(localProduction);

      const receive = await this.receivesService.replaceLocalProduction(
        date,
        localProduction,
        updateLocalProductionDto.date,
      );

      await this.receivesService.recalculateAndSave(receive);
      return {
        message: `Produção local id(${id}) atualizado com sucesso`,
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

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async getGrouped(filters: LocalProductionPeriodFilter) {
    const { dateFrom, dateTo } = filters;

    const query =
      this.localProductionRepository.createQueryBuilder('production');

    if (dateFrom) query.andWhere('production.date >= :dateFrom', { dateFrom });
    if (dateTo) query.andWhere('production.date <= :dateTo', { dateTo });

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
    const { dateFrom, dateTo } = filters;

    if (dateFrom) query.andWhere('production.date >= :dateFrom', { dateFrom });
    if (dateTo) query.andWhere('production.date <= :dateTo', { dateTo });

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
