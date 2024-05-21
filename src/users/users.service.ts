import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: CreateUserDto) {
    try {
      const createdUser = new this.userModel(user);
      return await createdUser.save();
    } catch (error) {
      throw new HttpException(
        error.message || 'something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new HttpException('User do not exists', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(
        error.message || 'something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.userModel.findById({ _id: userId });
      if (!user) {
        throw new HttpException('User do not exists', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(
        error.message || 'something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUsers() {
    return await this.userModel.find();
  }

  async addUserGoal(userId: string, goalId: string) {
    const user = await this.getUserById(userId);
    await user.updateOne({
      $push: {
        goals: goalId,
      },
    });
  }

  async deleteUserGoal(userId: string, goalId: string) {
    await this.userModel.updateOne(
      { _id: userId },
      {
        $pullAll: {
          goals: [goalId],
        },
      },
    );
  }

  async updateUser(userId: string, userDetails: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        { _id: userId },
        { ...userDetails },
        { new: true },
      );
      if (!updatedUser) throw new NotFoundException('User do not exists');
      return updatedUser;
    } catch (error) {
      throw new HttpException(
        error.message || 'something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
