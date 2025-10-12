import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginAttempt } from './login-attempt-entity';
import { MoreThan, Repository } from 'typeorm';
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

  async isBlocked(
    username: string,
    limit = Number(process.env.LOGIN_ATTEMPT_LIMIT),
    period = Number(process.env.LOGIN_ATTEMPT_PERIOD),
  ): Promise<boolean> {
    const since = new Date(Date.now() - period * 60 * 1000);

    const failures = await this.loginAttemptRepository.count({
      where: { username, success: false, createdAt: MoreThan(since) },
    });

    return failures >= limit;
  }
}
