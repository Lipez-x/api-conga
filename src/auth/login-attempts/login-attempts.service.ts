import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginAttempt } from './login-attempt-entity';
import { Repository } from 'typeorm';
import { LoginLog } from '../interfaces/login-log';

@Injectable()
export class LoginAttemptsService {
  constructor(
    @InjectRepository(LoginAttempt)
    private readonly loginAttemptRepository: Repository<LoginAttempt>,
  ) {}

  async register(loginLog: LoginLog) {
    const attempt = this.loginAttemptRepository.create(loginLog);
    return this.loginAttemptRepository.save(attempt);
  }
}
