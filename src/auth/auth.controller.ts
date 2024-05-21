import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SkipAuth } from './decorators/auth.decorator';
import { CreateUserDto } from '@users/dtos/create-user.dto';
import { User } from '@users/schemas/users.schema';
import { UserDto } from '@users/dtos/user.dto';
import { Response } from 'express';

@SkipAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async sigUp(@Body() user: CreateUserDto): Promise<User> {
    return this.authService.signUp(user);
  }

  @Post('signin')
  async signIn(
    @Body() user: UserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.authService.signIn(user);
    response.cookie('session', jwt.access_token, { httpOnly: true });
    return {
      message: 'authenticated successfully',
      token: jwt.access_token,
    };
  }

  @Get('signout')
  async signOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('session');
    return {
      message: 'logged-out successfully',
    };
  }
}
