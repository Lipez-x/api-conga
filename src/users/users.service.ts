import {
  BadRequestException,
  ConflictException,
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

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { name, username, role, password, confirmPassword } = registerUserDto;

    const finalPassword = password ? password : process.env.DEFAULT_PASSWORD;
    const finalConfirmPassword = confirmPassword
      ? confirmPassword
      : process.env.DEFAULT_PASSWORD;

    if (!finalPassword || finalPassword !== finalConfirmPassword) {
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
    const hashedPassword = await bcrypt.hash(finalPassword, salt);

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

  async findById(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'username', 'role'],
    });
  }

  async updatePassword(password: string, confirmPassword: string) {
    if (!password) return;
    if (password !== confirmPassword) {
      throw new BadRequestException('A senha não foi confirmada corretamente');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  async updateCollaborator(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`Usuário de id (${id}) não existe`);
    }

    if (updateUserDto.username != undefined) {
      const existsUserByUsername = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });

      if (existsUserByUsername && existsUserByUsername.id !== user.id) {
        throw new ConflictException(
          'Já existe um usuário cadastro com esse username',
        );
      }
    }

    const hashedPassword = await this.updatePassword(
      updateUserDto.password,
      updateUserDto.confirmPassword,
    );

    hashedPassword ? (user.hashedPassword = hashedPassword) : undefined;
    try {
      const updatedUser = await this.userRepository.save(user);
      return {
        ...updatedUser,
        hashedPassword: undefined,
      };
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteCollaborator(id: string) {
    try {
      const personnelCost = await this.userRepository.findOne({
        where: { id },
      });

      if (!personnelCost) {
        throw new NotFoundException(`Usuário de id ${id} não encontrado`);
      }

      await this.userRepository.delete(personnelCost);
      return { message: `Usuário com id(${id}) deletado com sucesso` };
    } catch (error) {
      this.logger.error(error.message);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
