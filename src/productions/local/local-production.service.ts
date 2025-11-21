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

    const query =
      this.localProductionRepository.createQueryBuilder('production');

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
        .take(10)
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
      const localProduction = await this.localProductionRepository.preload({
        id: id,
        ...updateLocalProductionDto,
      });

      if (!localProduction) {
        throw new NotFoundException(
          `Produção local de id ${id} não encontrada`,
        );
      }

      const receive = await this.receivesService.getUpdatedReceive(
        localProduction.date,
        localProduction,
        updateLocalProductionDto.date,
      );

      await this.localProductionRepository.save(localProduction);
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
}
