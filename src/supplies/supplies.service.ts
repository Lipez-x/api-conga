import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplies } from './entities/supplies.entity';
import { Repository } from 'typeorm';
import { RegisterSuppliesDto } from './dtos/register-supplies.dto';
import { FilterSuppliesDto } from './dtos/filter-supplies.dto';
import { UpdateSuppliesDto } from './dtos/update-supplies.dto';

@Injectable()
export class SuppliesService {
  private logger = new Logger(SuppliesService.name);
  constructor(
    @InjectRepository(Supplies)
    private readonly suppliesRepository: Repository<Supplies>,
  ) {}

  async register(registerSuppliesDto: RegisterSuppliesDto) {
    try {
      const supply = this.suppliesRepository.create({
        ...registerSuppliesDto,
      });

      return await this.suppliesRepository.save(supply);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(filters: FilterSuppliesDto) {
    const {
      name,
      dateFrom,
      dateTo,
      minQuantity,
      maxQuantity,
      minUnitPrice,
      maxUnitPrice,
      minTotal,
      maxTotal,
      page = 1,
      limit = 10,
    } = filters;

    const query = this.suppliesRepository.createQueryBuilder('supplies');
    if (name)
      query.andWhere('supplies.name ILIKE :name', { name: `%${name}%` });
    if (dateFrom) query.andWhere('supplies.date >= :dateFrom', { dateFrom });
    if (dateTo) query.andWhere('supplies.date <= :dateTo', { dateTo });
    if (minQuantity)
      query.andWhere('supplies.quantity >= :minQuantity', { minQuantity });
    if (maxQuantity)
      query.andWhere('supplies.quantity <= :maxQuantity', { maxQuantity });
    if (minUnitPrice)
      query.andWhere('supplies.unit_price >= :minUnitPrice', { minUnitPrice });
    if (maxUnitPrice)
      query.andWhere('supplies.unit_price <= :maxUnitPrice', { maxUnitPrice });
    if (minTotal)
      query.andWhere('supplies.total_cost >= :minTotal', { minTotal });
    if (maxTotal)
      query.andWhere('supplies.total_cost <= :maxTotal', { maxTotal });

    try {
      const [data, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

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
      const supply = await this.suppliesRepository.findOne({
        where: { id },
      });

      if (!supply) {
        throw new NotFoundException(
          `Custo com insumo de id ${id} não encontrado`,
        );
      }

      return supply;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateSuppliesDto: UpdateSuppliesDto) {
    try {
      const supply = await this.suppliesRepository.preload({
        id,
        ...updateSuppliesDto,
      });

      if (!supply) {
        throw new NotFoundException(
          `Custo com insumo de id ${id} não encontrado`,
        );
      }

      return await this.suppliesRepository.save(supply);
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
      const supply = await this.suppliesRepository.findOne({
        where: { id },
      });

      if (!supply) {
        throw new NotFoundException(
          `Custo com insumo de id ${id} não encontrado`,
        );
      }

      await this.suppliesRepository.delete(id);
      return { message: `Custo com insumo id(${id}) deletado com sucesso` };
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
