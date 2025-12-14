import {
  Body,
  Controller,
  Delete,
  Get,
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
import { plainToInstance } from 'class-transformer';

@UsePipes(ValidationPipe)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.ADMIN)
  @Post('/register')
  async register(@Body() dto: RegisterUserDto): Promise<UserResponseDto> {
    const user = this.usersService.register(dto);
    return plainToInstance(UserResponseDto, user);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  async findCollaborators(@Query() filters: UserFilterDto): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: UserResponseDto[];
  }> {
    return await this.usersService.findCollaborators(filters);
  }

  @Get('/:id')
  async findById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    return plainToInstance(UserResponseDto, user);
  }

  @Roles(UserRole.COLLABORATOR)
  @Put('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(CheckCollaboratorInterceptor, UserMatchInterceptor)
  async updateCollaborator(
    @CurrentUser() _user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.updateCollaborator(id, dto);
    return plainToInstance(UserResponseDto, user);
  }

  @Roles(UserRole.ADMIN)
  @Delete('/:id')
  @UseInterceptors(CheckCollaboratorInterceptor)
  async deleteCollaborator(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.deleteCollaborator(id);
  }
}
