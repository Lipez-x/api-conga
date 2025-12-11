import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export class UserMatchInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    const user = req.user;
    const userId = req.params.id;

    if (user.id !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para alterar esse usuário',
      );
    }

    return next.handle();
  }
}
