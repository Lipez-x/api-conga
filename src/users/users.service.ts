import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dtos/register-user.dto';
import * as bcrypt from 'bcrypt';
import { UserFilterDto } from './dtos/user-filter.dto';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { name, username, role, password, confirmPassword } = registerUserDto;

    if (password != confirmPassword) {
      throw new BadRequestException('A senha não foi confirmada corretamente');
    }

    const existsUser = await this.userRepository.findOne({
      where: { username: username },
    });

    if (existsUser) {
      throw new ConflictException(
        'Já existe um usuário cadastro com esse username',
      );
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const createUser = this.userRepository.create({
        name,
        username,
        role,
        hashedPassword,
      });

      await this.userRepository.save(createUser);
      return {
        ...createUser,
        hashedPassword: undefined,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findCollaborators(userFilterDto: UserFilterDto) {
    const { name, username, page = 1, limit = 10 } = userFilterDto;

    const query = this.userRepository
      .createQueryBuilder('users')
      .where('users.role = :role', { role: UserRole.COLLABORATOR })
      .select(['users.id', 'users.name', 'users.username', 'users.role']);

    if (name) query.andWhere('users.name ILIKE :name', { name: `%${name}%` });
    if (username)
      query.andWhere('users.username ILIKE :username', {
        username: `%${username}%`,
      });

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

  async findByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }
}
