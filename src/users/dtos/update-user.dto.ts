import { IsOptional, IsString } from 'class-validator';
import {} from '../enums/user-role.enum';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  confirmPassword?: string;
}
