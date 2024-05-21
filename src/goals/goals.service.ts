import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Goal } from './schemas/goals.schema';
import { CreateGoalDto } from './dtos/create-goal.dto';
import { UsersService } from '@users/users.service';
import { UpdateGoalDto } from './dtos/update-goal.dto';
import { Connection, Model } from 'mongoose';
import { TasksService } from '@goals/tasks.service';

@Injectable()
export class GoalsService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Goal.name) private goalModel: Model<Goal>,
    private userService: UsersService,
    @Inject(forwardRef(() => TasksService))
    private taskService: TasksService,
  ) {}

  async getGoals(): Promise<Goal[]> {
    try {
      const goals = this.goalModel.find();
      return goals;
    } catch (error) {
      throw new HttpException(
        error.message || 'something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createGoal(userId: string, goalDeatils: CreateGoalDto) {
    try {
      const user = await this.userService.getUserById(userId);
      const createdGoal = new this.goalModel({
        ...goalDeatils,
        user: user._id,
      });
      const savedGoal = await createdGoal.save();
      await this.userService.addUserGoal(userId, savedGoal._id.toString());
      return savedGoal;
    } catch (error) {
      throw new HttpException(
        error.message || 'something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateGoal(goalId: string, goalDetails: UpdateGoalDto) {
    try {
      const updatedGoal = await this.goalModel.findByIdAndUpdate(
        { _id: goalId },
        { ...goalDetails },
        { new: true },
      );
      if (!updatedGoal) throw new NotFoundException('Goal do not exists');
      return updatedGoal;
    } catch (error) {
      throw new HttpException(
        error.message || 'something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getGoalById(goalId: string) {
    try {
      const goal = (await this.goalModel.findById({ _id: goalId })).populate(
        'tasks',
      );
      if (!goal) throw new NotFoundException('Goal not found');
      return goal;
    } catch (error) {
      throw new HttpException(
        error.message || 'something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteGoal(goalId: string) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const goal = await this.getGoalById(goalId);
      if (!goal) throw new NotFoundException('Goal not found');
      const userId = goal.user.toString();
      await this.goalModel.findOneAndDelete({
        _id: goalId,
      });
      await this.userService.deleteUserGoal(userId, goalId);
      await this.taskService.deleteTaskByGoal(goalId);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new HttpException(
        error.message || 'something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      session.endSession();
    }
  }

  async addGoalTask(goalId: string, taskId: string) {
    const goal = await this.getGoalById(goalId);
    await goal.updateOne({
      $push: {
        tasks: taskId,
      },
    });
  }

  async deleteGoalTask(goalId: string, taskId: string) {
    await this.goalModel.updateOne(
      { _id: goalId },
      {
        $pullAll: {
          tasks: [taskId],
        },
      },
    );
  }
}
