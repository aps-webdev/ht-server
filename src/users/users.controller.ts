import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dtos/update-user.dto';
import { env } from 'process';

interface AuthenticatedRequest extends Request {
  user: {
    id: string | null | undefined;
    email: string;
  };
}

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Get('/me')
  async getCurrentUser(@Req() request: AuthenticatedRequest) {
    try {
      // const userId = request.user.id;
      // const user = (await this.userService.getUserById(userId)).populate(
      //   'goals',
      // );
      // return user;
      const cookie = request.cookies['session'];
      const userData = await this.jwtService.verifyAsync(cookie, {
        secret: env.JWT_SECRET,
      });
      if (!userData) {
        throw new UnauthorizedException();
      }
      const user = (await this.userService.getUserById(userData.id)).populate(
        'goals',
      );
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @Get('/:userId')
  async getUserById(@Param('userId') userId: string) {
    return await this.userService.getUserById(userId);
  }

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Post('/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() userDetails: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, userDetails);
  }
}
