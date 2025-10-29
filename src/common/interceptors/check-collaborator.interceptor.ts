import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRole } from 'src/users/enums/user-role.enum';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CheckCollaboratorInterceptor implements NestInterceptor {
  constructor(private readonly userService: UsersService) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const user = await this.userService.findById(req.params.id);

    if (user?.role !== UserRole.COLLABORATOR) {
      throw new ForbiddenException(
        'O nível de permissão do usuário não permite que ele seja modificado.',
      );
    }

    return next.handle();
  }
}
