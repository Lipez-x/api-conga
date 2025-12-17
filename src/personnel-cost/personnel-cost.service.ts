import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RegisterPersonnelCostDto } from './dtos/register-personnel-cost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonnelCost } from './entities/personnel-cost.entity';
import { Repository } from 'typeorm';
import { PersonnelCostFilterDto } from './dtos/personnel-cost-filter.dto';
import { UpdatePersonnelCostDto } from './dtos/update-personnel-cost.dto';
import { ExpenseType } from 'src/expenses/enums/expense-type.enum';
import { ExpensesService } from 'src/expenses/expenses.service';
import { applyPeriodFilter } from 'src/common/helpers/apply-period-filters';
import { paginate } from 'src/common/helpers/paginate';

@Injectable()
export class PersonnelCostService {
  private readonly logger = new Logger(PersonnelCostService.name);

  constructor(
    @InjectRepository(PersonnelCost)
    private readonly personnelCostRepository: Repository<PersonnelCost>,
    private readonly expensesService: ExpensesService,
  ) {}

  async register(registerPersonnelCostDto: RegisterPersonnelCostDto) {
    try {
      const personnelCost = this.personnelCostRepository.create({
        expense: {
          date: registerPersonnelCostDto.date,
          value: registerPersonnelCostDto.value,
          category: ExpenseType.PERSONNEL,
        },
        ...registerPersonnelCostDto,
      });

      await this.personnelCostRepository.save(personnelCost);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(filters: PersonnelCostFilterDto) {
    const {
      type,
      minValue,
      maxValue,
      description,
      page = 1,
      limit = 10,
    } = filters;

    const query = this.personnelCostRepository
      .createQueryBuilder('cost')
      .leftJoinAndSelect('cost.expense', 'expense')
      .orderBy('expense.date', 'DESC');

    applyPeriodFilter(query, filters, { alias: 'expense' });

    if (type) query.andWhere('cost.type = :type', { type });
    if (minValue) query.andWhere('expense.value >= :minValue', { minValue });
    if (maxValue) query.andWhere('expense.value <= :maxValue', { maxValue });
    if (description)
      query.andWhere('cost.description ILIKE :description', {
        description: `%${description}%`,
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
      const personnelCost = await this.personnelCostRepository.findOne({
        where: { id },
        relations: ['expense'],
      });

      if (!personnelCost) {
        throw new NotFoundException(
          `Custo com pessoal de id ${id} não encontrado`,
        );
      }

      return personnelCost;
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
      const lastCost = await this.personnelCostRepository
        .createQueryBuilder('cost')
        .leftJoinAndSelect('cost.expense', 'expense')
        .orderBy('expense.date', 'DESC')
        .getOne();

      return lastCost;
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updatePersonnelCostDto: UpdatePersonnelCostDto) {
    try {
      const personnelCost = await this.personnelCostRepository.findOne({
        where: { id },
        relations: ['expense'],
      });

      if (!personnelCost) {
        throw new NotFoundException(
          `Custo com pessoal de id ${id} não encontrado`,
        );
      }

      Object.assign(personnelCost, updatePersonnelCostDto);
      if (updatePersonnelCostDto.date || updatePersonnelCostDto.value) {
        Object.assign(personnelCost.expense, {
          date: updatePersonnelCostDto.date,
          value: updatePersonnelCostDto.value,
        });
      }

      await this.personnelCostRepository.save(personnelCost);
      return {
        message: `Custo com pessoal id(${id}) atualizado com sucesso`,
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
      const personnelCost = await this.personnelCostRepository.findOne({
        where: { id },
        relations: ['expense'],
      });

      if (!personnelCost) {
        throw new NotFoundException(
          `Custo com pessoal de id ${id} não encontrado`,
        );
      }

      await this.expensesService.delete(personnelCost.expense.id);
      return { message: `Custo com pessoal id(${id}) deletado com sucesso` };
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
