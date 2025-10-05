import { Request } from 'express';
import { User } from './user.interface';

export interface AuthRequest extends Request {
  user: User;
}
