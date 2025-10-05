import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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
