import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UsersService } from './users.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from './enums/user-role.enum';
import { UserFilterDto } from './dtos/user-filter.dto';
import { CheckCollaboratorInterceptor } from 'src/common/interceptors/check-collaborator.interceptor';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserMatchInterceptor } from 'src/common/interceptors/user-match.interceptor';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dtos/user-response.dto';

@UsePipes(ValidationPipe)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.ADMIN)
  @Post('/register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.register(registerUserDto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  async findCollaborators(@Query() userFilterDto: UserFilterDto): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: UserResponseDto[];
  }> {
    return await this.usersService.findCollaborators(userFilterDto);
  }

  @Get('/:id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserResponseDto> {
    return await this.usersService.findById(id);
  }

  @Roles(UserRole.COLLABORATOR)
  @Put('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(CheckCollaboratorInterceptor, UserMatchInterceptor)
  async updateCollaborator(
    @CurrentUser() _user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.updateCollaborator(id, updateUserDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete('/:id')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(CheckCollaboratorInterceptor)
  async deleteCollaborator(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.deleteCollaborator(id);
  }
}
