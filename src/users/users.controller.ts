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
import { IsPublic } from 'src/common/decorators/is-public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from './enums/user-role.enum';
import { UserFilterDto } from './dtos/user-filter.dto';
import { CheckCollaboratorInterceptor } from 'src/common/interceptors/check-collaborator.interceptor';
import { UpdateUserDto } from './dtos/update-user.dto';

@Roles(UserRole.ADMIN)
@Controller('users')
export class UsersController {
  private logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @IsPublic()
  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(@Body() registerUserDto: RegisterUserDto) {
    this.logger.log(`User: ${JSON.stringify(registerUserDto)}`);
    return this.usersService.register(registerUserDto);
  }

  @Get()
  async findCollaborators(@Query() userFilterDto: UserFilterDto) {
    return await this.usersService.findCollaborators(userFilterDto);
  }

  @Get(':id')
  async findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.findById(id);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(CheckCollaboratorInterceptor)
  async updateCollaborator(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateCollaborator(id, updateUserDto);
  }

  @Delete(':id')
  @UseInterceptors(CheckCollaboratorInterceptor)
  async deleteCollaborator(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.deleteCollaborator(id);
  }
}
