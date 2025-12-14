import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dtos/register-user.dto';
import * as bcrypt from 'bcrypt';
import { UserFilterDto } from './dtos/user-filter.dto';
import { UserRole } from './enums/user-role.enum';
import { UpdateUserDto } from './dtos/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dtos/user-response.dto';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  async register(dto: RegisterUserDto): Promise<User> {
    const password = dto.password ? dto.password : process.env.DEFAULT_PASSWORD;
    const confirmPassword = dto.confirmPassword
      ? dto.confirmPassword
      : process.env.DEFAULT_PASSWORD;

    if (!password || password !== confirmPassword) {
      throw new BadRequestException('A senha não foi confirmada corretamente');
    }

    const existsUser = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (existsUser) {
      throw new ConflictException(
        'Já existe um usuário cadastro com esse username',
      );
    }

    try {
      const createUser = this.userRepository.create({
        name: dto.name,
        username: dto.username,
        role: dto.role,
        hashedPassword: await this.hashPassword(password),
      });

      await this.userRepository.save(createUser);
      return createUser;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findCollaborators(filters: UserFilterDto) {
    const { name, username, page = 1, limit = 10 } = filters;

    const query = this.userRepository
      .createQueryBuilder('users')
      .where('users.role = :role', { role: UserRole.COLLABORATOR });

    if (name) query.andWhere('users.name ILIKE :name', { name: `%${name}%` });
    if (username)
      query.andWhere('users.username ILIKE :username', {
        username: `%${username}%`,
      });

    try {
      const [rows, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      const data = plainToInstance(UserResponseDto, rows);

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

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuário de id (${id}) não existe`);
    }

    return user;
  }

  async updateCollaborator(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      ...dto,
    });

    if (!user) {
      throw new NotFoundException(`Usuário de id (${id}) não existe`);
    }

    if (dto.username) {
      const existsUserByUsername = await this.userRepository.findOne({
        where: { username: dto.username },
      });

      if (existsUserByUsername && existsUserByUsername.id !== user.id) {
        throw new ConflictException(
          'Já existe um usuário cadastrado com esse username',
        );
      }
    }

    if (dto.password) {
      if (dto.password !== dto.confirmPassword) {
        throw new BadRequestException(
          'A senha não foi confirmada corretamente',
        );
      }

      user.hashedPassword = await this.hashPassword(dto.password);
    }

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteCollaborator(id: string) {
    const user = await this.userRepository.exists({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário de id (${id}) não existe`);
    }

    try {
      await this.userRepository.delete(id);
      return { message: `Usuário com id(${id}) deletado com sucesso` };
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
