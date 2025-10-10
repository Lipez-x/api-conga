import { UserRole } from 'src/users/enums/user-role.enum';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  hashedPassword: string;
}
