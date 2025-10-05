import { Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { AuthRequest } from './interfaces/auth-request';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Request() req: AuthRequest) {
    return await this.authService.login(req.user);
  }
}
