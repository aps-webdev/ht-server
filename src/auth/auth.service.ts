import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '@users/users.service';
import { CreateUserDto } from '@users/dtos/create-user.dto';
import { UserDto } from '@users/dtos/user.dto';
import { User } from '@users/schemas/users.schema';
import { env } from 'process';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async signUp(user: CreateUserDto): Promise<User> {
    try {
      const salt = bcrypt.genSaltSync();
      const hashedPassword = bcrypt.hashSync(user.password, salt);
      const createdUser = this.userService.createUser({
        ...user,
        password: hashedPassword,
      });
      return createdUser;
    } catch (error) {
      throw new HttpException(
        error.message || 'something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signIn(userDetails: UserDto): Promise<{ access_token: string }> {
    try {
      const { password: enteredPassword } = userDetails;
      const user = await this.userService.getUserByEmail(userDetails.email);
      const isPasswordMatched = bcrypt.compareSync(
        enteredPassword,
        user.password,
      );
      if (!isPasswordMatched) throw new UnauthorizedException();
      const jwtPayload = {
        id: user['_id'].toString(),
        email: user.email,
      };
      return {
        access_token: await this.jwtService.signAsync(jwtPayload, {
          secret: env.JWT_SECRET,
        }),
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserIdFromToken(): Promise<string> {
    const cookies = this.request.cookies;
    const payload = await this.jwtService.verifyAsync(cookies.session, {
      secret: env.JWT_SECRET,
    });
    return payload.id;
  }
}
