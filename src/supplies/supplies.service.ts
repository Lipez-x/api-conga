import {
  HttpException,
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
import { ExpenseType } from 'src/expenses/enums/expense-type.enum';
import { ExpensesService } from 'src/expenses/expenses.service';
import { applyPeriodFilter } from 'src/common/helpers/apply-period-filters';
import { paginate } from 'src/common/helpers/paginate';

@Injectable()
export class SuppliesService {
  private logger = new Logger(SuppliesService.name);
  constructor(
    @InjectRepository(Supplies)
    private readonly suppliesRepository: Repository<Supplies>,
    private readonly expensesService: ExpensesService,
  ) {}

  async register(registerSuppliesDto: RegisterSuppliesDto) {
    try {
      const supply = this.suppliesRepository.create({
        expense: {
          date: registerSuppliesDto.date,
          category: ExpenseType.SUPPLIES,
        },
        ...registerSuppliesDto,
      });

      await this.suppliesRepository.save(supply);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(filters: FilterSuppliesDto) {
    const {
      name,
      minQuantity,
      maxQuantity,
      minUnitPrice,
      maxUnitPrice,
      minTotal,
      maxTotal,
      page = 1,
      limit = 10,
    } = filters;

    const query = this.suppliesRepository
      .createQueryBuilder('supplies')
      .leftJoinAndSelect('supplies.expense', 'expense')
      .orderBy('expense.date', 'DESC');

    applyPeriodFilter(query, filters, { alias: 'expense' });

    if (name)
      query.andWhere('supplies.name ILIKE :name', { name: `%${name}%` });
    if (minQuantity)
      query.andWhere('supplies.quantity >= :minQuantity', { minQuantity });
    if (maxQuantity)
      query.andWhere('supplies.quantity <= :maxQuantity', { maxQuantity });
    if (minUnitPrice)
      query.andWhere('supplies.unit_price >= :minUnitPrice', { minUnitPrice });
    if (maxUnitPrice)
      query.andWhere('supplies.unit_price <= :maxUnitPrice', { maxUnitPrice });
    if (minTotal) query.andWhere('expense.value >= :minTotal', { minTotal });
    if (maxTotal) query.andWhere('expense.value <= :maxTotal', { maxTotal });

    try {
      return await paginate(query, page, limit);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findById(id: string) {
    try {
      const supply = await this.suppliesRepository.findOne({
        where: { id },
        relations: ['expense'],
      });

      if (!supply) {
        throw new NotFoundException(
          `Custo com insumo de id ${id} não encontrado`,
        );
      }

      return supply;
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
      const lastSupply = await this.suppliesRepository
        .createQueryBuilder('supplies')
        .leftJoinAndSelect('supplies.expense', 'expense')
        .orderBy('expense.date', 'DESC')
        .getOne();

      return lastSupply;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateSuppliesDto: UpdateSuppliesDto) {
    try {
      const supply = await this.suppliesRepository.findOne({
        where: { id },
        relations: ['expense'],
      });

      if (!supply) {
        throw new NotFoundException(
          `Custo com insumo de id ${id} não encontrado`,
        );
      }

      Object.assign(supply, updateSuppliesDto);
      if (updateSuppliesDto.date) {
        Object.assign(supply.expense, {
          date: updateSuppliesDto.date,
        });
      }

      await this.suppliesRepository.save(supply);
      return {
        message: `Custo com insumo id(${id}) atualizado com sucesso`,
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
      const supply = await this.suppliesRepository.findOne({
        where: { id },
        relations: ['expense'],
      });

      if (!supply) {
        throw new NotFoundException(
          `Custo com insumo de id ${id} não encontrado`,
        );
      }

      await this.expensesService.delete(supply.expense.id);
      return { message: `Custo com insumo id(${id}) deletado com sucesso` };
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
