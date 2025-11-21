import {
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

@Injectable()
export class ReceivesService {
  private logger = new Logger(ReceivesService.name);
  constructor(
    @InjectRepository(Receive)
    private readonly receiveRepository: Repository<Receive>,
    private readonly salePriceService: SalePriceService,
  ) {}

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
        return await this.create(date);
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

  async getUpdatedReceive(
    date: Date,
    production: LocalProduction,
    newDate?: Date,
  ) {
    try {
      console.log(date);

      let receive: Receive = await this.findByDate(date);

      if (newDate != undefined) {
        console.log('oi');

        await this.removeLocalProduction(receive);
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

  async removeLocalProduction(receive: Receive) {
    try {
      receive.localProductions = receive.localProductions.filter(
        (production) => production.id !== production.id,
      );

      await this.recalculateAndSave(receive);
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
