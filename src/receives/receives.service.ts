import {
  forwardRef,
  HttpException,
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
import { plainToInstance } from 'class-transformer';
import { ReceivesResponseDto } from './dtos/receives-response.dto';
import { paginate } from 'src/common/helpers/paginate';
import { applyPeriodFilter } from 'src/common/helpers/apply-period-filters';
import { getCurrentMonthRange } from 'src/common/helpers/get-current-month';

@Injectable()
export class ReceivesService {
  private logger = new Logger(ReceivesService.name);
  constructor(
    @InjectRepository(Receive)
    private readonly receiveRepository: Repository<Receive>,
    @Inject(forwardRef(() => SalePriceService))
    private readonly salePriceService: SalePriceService,
  ) {}

  async getDaily(filters: ReceivesFilterDto) {
    const query = this.receiveRepository.createQueryBuilder('receive');

    applyPeriodFilter(query, filters, { alias: 'receive' });

    const dailyReceives = await query
      .select(`to_char(receive.date, 'YYYY-MM-DD')`, 'date')
      .addSelect('receive.totalPrice', 'totalPrice')
      .getRawMany();

    return dailyReceives.map((r) => ({
      date: r.date,
      totalPrice: Number(r.totalPrice),
    }));
  }

  async monthlyTotal() {
    const { start, end } = getCurrentMonthRange();

    const receivesSum = await this.receiveRepository
      .createQueryBuilder('receive')
      .select('SUM(receive.totalPrice)', 'total')
      .where('receive.date BETWEEN :start AND :end', {
        start,
        end,
      })
      .getRawOne();

    return Number(receivesSum.total) || 0;
  }

  async getOfTheDay() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const receivesSum = await this.receiveRepository
      .createQueryBuilder('receive')
      .select('SUM(receive.totalPrice)', 'total')
      .where('receive.date = :date', {
        date: currentDate,
      })
      .getRawOne();

    return Number(receivesSum.total) || 0;
  }

  async averageDaily() {
    const { start, end } = getCurrentMonthRange();

    const average = await this.receiveRepository
      .createQueryBuilder('receive')
      .select('AVG(receive.totalPrice)', 'total')
      .where('receive.date BETWEEN :start AND :end', {
        start,
        end,
      })
      .getRawOne();

    return Number(average.total);
  }

  async getTotal(filters: ReceivesFilterDto) {
    const query = this.receiveRepository.createQueryBuilder('receive');

    applyPeriodFilter(query, filters, { alias: 'receive' });

    const receivesSum = await query
      .select('SUM(receive.totalPrice)', 'total')
      .getRawOne();

    return receivesSum;
  }

  async findAll(filters: ReceivesFilterDto) {
    const {
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

    applyPeriodFilter(query, filters, { alias: 'receive' });

    if (minTank)
      query.andWhere('receive.tank_quantity >= :minTank', { minTank });
    if (maxTank)
      query.andWhere('receive.tank_quantity <= maxTank', { maxTank });
    if (minValue)
      query.andWhere('receive.totalPrice >= :minValue', { minValue });
    if (maxValue)
      query.andWhere('receive.totalPrice <= :maxValue', { maxValue });

    try {
      const [average, monthly, paginated] = await Promise.all([
        this.averageDaily(),
        this.monthlyTotal(),
        paginate(query, page, limit),
      ]);

      const data = plainToInstance(ReceivesResponseDto, paginated.data);

      return {
        average,
        monthly,
        ...paginated,
        data,
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
      if (error instanceof HttpException) {
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
      if (error instanceof HttpException) {
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
      if (error instanceof HttpException) {
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
      if (error instanceof HttpException) {
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
      throw new InternalServerErrorException(error.message);
    }
  }
}
