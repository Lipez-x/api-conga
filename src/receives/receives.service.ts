import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Receive } from './entities/receive.entity';
import { Repository } from 'typeorm';
import { SalePriceService } from 'src/sale-price/sale-price.service';
import { LocalProduction } from 'src/productions/local/entities/local-production.entity';
import { ProducerProduction } from 'src/productions/producer/entities/producer-production.entity';
import { ReceivesFilterDto } from './dtos/receives-filter.dto';

@Injectable()
export class ReceivesService {
  private logger = new Logger(ReceivesService.name);
  constructor(
    @InjectRepository(Receive)
    private readonly receiveRepository: Repository<Receive>,
    @Inject(forwardRef(() => SalePriceService))
    private readonly salePriceService: SalePriceService,
  ) {}

  async findAll(filters: ReceivesFilterDto) {
    const {
      dateFrom,
      dateTo,
      minTank,
      maxTank,
      minValue,
      maxValue,
      page = 1,
      limit = 10,
    } = filters;

    const query = this.receiveRepository
      .createQueryBuilder('receive')
      .orderBy('receive.date', 'DESC');

    if (dateFrom) query.andWhere('receive.date >= :dateFrom', { dateFrom });
    if (dateTo) query.andWhere('receive.date <= :dateTo', { dateTo });
    if (minTank)
      query.andWhere('receive.tank_quantity >= :minTank', { minTank });
    if (maxTank)
      query.andWhere('receive.tank_quantity <= maxTank', { maxTank });
    if (minValue)
      query.andWhere('receive.totalPrice >= :minValue', { minValue });
    if (maxValue)
      query.andWhere('receive.totalPrice <= :maxValue', { maxValue });

    try {
      const [rows, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      const average = await this.averageDaily();
      const monthly = await this.monthlyTotal();

      return {
        average,
        monthly,
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

  async findByDate(date: Date) {
    try {
      const receive = await this.receiveRepository.findOne({
        where: { date },
        relations: ['localProductions', 'producerProductions'],
      });

      if (!receive) {
        throw new NotFoundException(`Receita da data ${date} não encontrada`);
      }

      return receive;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async findOrCreate(date: Date) {
    try {
      const receive = await this.receiveRepository.findOne({
        where: { date },
        relations: ['localProductions', 'producerProductions'],
      });

      if (!receive) {
        return await this.create(new Date(date + 'T23:59:59.999'));
      }

      return receive;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async create(date: Date) {
    try {
      const salePrice = await this.salePriceService.getByDate(date);

      if (!salePrice) {
        throw new NotFoundException('Preço do leite não encontrado');
      }

      const receive = this.receiveRepository.create({
        date: date,
        salePrice: salePrice.value,
        localProductions: [],
        producerProductions: [],
        tankQuantity: 0,
      });

      return await this.receiveRepository.save(receive);
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async recalculateAndSave(receive: Receive) {
    try {
      const totalLocal = receive.localProductions.reduce(
        (sum, lp) => sum + Number(lp.grossQuantity - lp.consumedQuantity),
        0,
      );

      const totalProducer = receive.producerProductions.reduce(
        (sum, pp) => sum + Number(pp.totalQuantity),
        0,
      );

      receive.tankQuantity = totalLocal + totalProducer;

      return await this.receiveRepository.save(receive);
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async updateSalePrice(date: Date, value: number) {
    try {
      const receive = await this.findByDate(date);

      receive.salePrice = value;

      await this.receiveRepository.save(receive);
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        return;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async replaceLocalProduction(
    date: Date,
    production: LocalProduction,
    newDate?: Date,
  ) {
    try {
      let receive: Receive = await this.findByDate(date);

      if (newDate !== date && newDate !== undefined) {
        await this.removeLocalProduction(receive, production);
        receive = await this.findOrCreate(newDate);
        receive.localProductions.push(production);
      }

      return receive;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async removeLocalProduction(receive: Receive, production: LocalProduction) {
    try {
      receive.localProductions = receive.localProductions.filter(
        (p) => p.id !== production.id,
      );

      await this.recalculateAndSave(receive);
      await this.remove(receive);
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async replaceProducerProduction(
    date: Date,
    production: ProducerProduction,
    newDate?: Date,
  ) {
    try {
      let receive: Receive = await this.findByDate(date);

      if (newDate !== date && newDate !== undefined) {
        await this.removeProducerProduction(receive, production);
        receive = await this.findOrCreate(newDate);
        receive.producerProductions.push(production);
      }

      return receive;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async removeProducerProduction(
    receive: Receive,
    production: ProducerProduction,
  ) {
    try {
      receive.producerProductions = receive.producerProductions.filter(
        (p) => p.id !== production.id,
      );

      await this.recalculateAndSave(receive);
      await this.remove(receive);
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(receive: Receive) {
    try {
      if (
        receive.localProductions.length === 0 &&
        receive.producerProductions.length === 0
      ) {
        return await this.receiveRepository.delete(receive.id);
      }

      return receive;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async monthlyTotal() {
    const currentDate = new Date();
    const startDateMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );

    const endDateMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    try {
      const receivesSum = await this.receiveRepository
        .createQueryBuilder('receive')
        .select('SUM(receive.totalPrice)', 'total')
        .where('receive.date BETWEEN :start AND :end', {
          start: startDateMonth,
          end: endDateMonth,
        })
        .getRawOne();

      return Number(receivesSum.total).toFixed(2) || 0;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOfTheDay() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    try {
      const receivesSum = await this.receiveRepository
        .createQueryBuilder('receive')
        .select('SUM(receive.totalPrice)', 'total')
        .where('receive.date = :date', {
          date: currentDate,
        })
        .getRawOne();

      return Number(receivesSum.total).toFixed(2) || 0;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async averageDaily() {
    const currentDate = new Date();
    const startDateMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );

    const endDateMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    const average = await this.receiveRepository
      .createQueryBuilder('receive')
      .select('AVG(receive.totalPrice)', 'total')
      .where('receive.date BETWEEN :start AND :end', {
        start: startDateMonth,
        end: endDateMonth,
      })
      .getRawOne();

    return Number(average.total).toFixed(2);
  }

  async getTotal(filters: ReceivesFilterDto) {
    const query = this.receiveRepository.createQueryBuilder('receive');
    const { dateFrom, dateTo } = filters;

    if (dateFrom) query.andWhere('receive.date >= :dateFrom', { dateFrom });
    if (dateTo) query.andWhere('receive.date <= :dateTo', { dateTo });

    try {
      const receivesSum = await query
        .select('SUM(receive.totalPrice)', 'total')
        .getRawOne();

      return receivesSum;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
