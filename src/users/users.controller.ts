import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { UsersService } from './users.service';
import { UserDto, UserDtoGroup } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { MyValidationPipe } from '../pipes/validation.pipe';
import { JwtAuthGuard } from '../guards/jwt.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body(new MyValidationPipe([UserDtoGroup.REGISTER]))
    data: UserDto,
  ) {
    return this.usersService.register(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new MyValidationPipe([UserDtoGroup.LOGIN]))
    data: LoginDto,
  ) {
    return this.usersService.login(data);
  }

  @ApiBearerAuth('user_auth')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: ExpressRequest) {
    return req.user;
  }
}
