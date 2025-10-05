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

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { username, role, password, confirmPassword } = registerUserDto;

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

    const salt = await bcrypt.genSalt(16);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const createUser = this.userRepository.create({
        username,
        role,
        hashedPassword,
      });

      await this.userRepository.save(createUser);
      return createUser;
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }
}
