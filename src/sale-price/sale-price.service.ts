import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { SalePrice } from './entities/sale-price-entity';
import { NewSalePriceDto } from './dtos/new-sale-price.dto';
import { ReceivesService } from 'src/receives/receives.service';

@Injectable()
export class SalePriceService {
  private logger = new Logger(SalePriceService.name);

  constructor(
    @InjectRepository(SalePrice)
    private readonly salePriceRepository: Repository<SalePrice>,
    @Inject(forwardRef(() => ReceivesService))
    private readonly receivesService: ReceivesService,
  ) {}

  async save(newSalePriceDto: NewSalePriceDto) {
    const { value } = newSalePriceDto;

    const activeSalePrice = await this.salePriceRepository.findOne({
      where: { endDate: new Date('9999-12-31') },
    });

    if (activeSalePrice) {
      const now = new Date();

      const endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );

      console.log(endDate);

      activeSalePrice.endDate = endDate;
      await this.salePriceRepository.save(activeSalePrice);
    }

    try {
      const salePrice = this.salePriceRepository.create({
        value,
        startDate: new Date(),
        endDate: new Date('9999-12-31'),
      });

      await this.salePriceRepository.save(salePrice);
      await this.receivesService.updateSalePrice(
        salePrice.startDate,
        salePrice.value,
      );

      const date = salePrice.startDate.toLocaleDateString('pt-BR');
      const time = salePrice.startDate.toTimeString();

      return {
        message: `Novo preço do leite definido: R$ ${salePrice.value.toFixed(2)} L, vigente a partir de ${date} às ${time}`,
      };
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async getByDate(date: Date) {
    try {
      const salePrice = await this.salePriceRepository.findOne({
        where: {
          startDate: LessThanOrEqual(date),
          endDate: MoreThanOrEqual(date),
        },
        order: { endDate: 'DESC' },
      });

      return salePrice;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
