import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  username: string;

  @Expose()
  role: string;

  @Exclude()
  hashedPassword: string;
}
