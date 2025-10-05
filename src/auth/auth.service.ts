import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from './interfaces/user.interface';
import { UserPayload } from './interfaces/user.payload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './interfaces/user-token';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(user: User): Promise<UserToken> {
    const userPayload: UserPayload = {
      sub: user.id,
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

    if (user) {
      const isValidPassword = await bcrypt.compare(
        password,
        user.hashedPassword,
      );

      if (isValidPassword) {
        return {
          ...user,
          hashedPassword: undefined,
        };
      }
    }

    throw new BadRequestException(
      'O username ou a senha informados não estão corretos',
    );
  }
}
