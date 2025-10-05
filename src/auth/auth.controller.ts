import {
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { AuthRequest } from './interfaces/auth-request';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { IsPublic } from 'src/common/decorators/is-public.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: AuthRequest) {
    return await this.authService.login(req.user);
  }
}
