import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../auth/interfaces/user.interface';
import { AuthRequest } from 'src/auth/interfaces/auth-request';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.user;
  },
);
