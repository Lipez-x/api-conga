import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import type { User } from './auth/interfaces/user.interface';
import { CurrentUser } from './common/decorators/current-user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return await this.appService.getDashboard();
  }

  @Get('/records')
  async getRecords() {
    return await this.appService.getRecords();
  }
}
