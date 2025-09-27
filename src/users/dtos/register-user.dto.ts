import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from "../enums/user-role.enum";

export class RegisterUserDto {

    @IsString()
    @IsNotEmpty()
    username: string
    
    @IsEnum(UserRole)
    role: UserRole

    @IsString()
    password: string

    @IsString()
    confirmPassword: string
}