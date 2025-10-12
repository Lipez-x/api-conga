import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from './interfaces/user.interface';
import { UserPayload } from './interfaces/user.payload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './interfaces/user-token';
import { LoginAttemptsService } from './login-attempts/login-attempts.service';
import { LoginLog } from './interfaces/login-log';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly loginAttemptsService: LoginAttemptsService,
  ) {}

  async login(user: User): Promise<UserToken> {
    const userPayload: UserPayload = {
      sub: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    };

    const token = this.jwtService.sign(userPayload);

    return {
      access_token: token,
    };
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    const blocked = await this.loginAttemptsService.isBlocked(username);

    if (blocked) {
      throw new UnauthorizedException(
        'Tentativas de login temporariamente bloqueadas',
      );
    }

    if (user) {
      const isValidPassword = await bcrypt.compare(
        password,
        user.hashedPassword,
      );

      if (isValidPassword) {
        const loginLogSuccess: LoginLog = {
          username: username,
          success: true,
        };

        await this.loginAttemptsService.register(loginLogSuccess);
        return {
          ...user,
          hashedPassword: undefined,
        };
      }
    }

    const loginLogError: LoginLog = {
      username: username,
      success: false,
    };

    await this.loginAttemptsService.register(loginLogError);
    throw new BadRequestException(
      'O username ou a senha informados não estão corretos',
    );
  }
}
