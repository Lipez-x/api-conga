import { UserRole } from 'src/users/enums/user-role.enum';

export interface UserPayload {
  sub: string | unknown;
  username: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
