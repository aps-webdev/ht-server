import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Task } from './schemas/tasks.schema';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { GoalsService } from '@tasks/goals.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @Inject(forwardRef(() => GoalsService))
    private goalService: GoalsService,
  ) {}

  async getAllTasks() {
    return await this.taskModel.find();
  }

  async getTaskById(taskId: string) {
    try {
      const task = await this.taskModel.findById({ _id: taskId });
      if (!task) throw new NotFoundException('Task do not exists');
      return task;
    } catch (error) {
      throw new HttpException(
        error.message || 'something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createTask(goalId: string, taskDetails: CreateTaskDto) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      await this.goalService.getGoalById(goalId);
      const createdTask = new this.taskModel({ ...taskDetails, goal: goalId });
      const savedTask = await createdTask.save();
      await this.goalService.addGoalTask(goalId, savedTask._id.toString());
      session.commitTransaction();
      return savedTask;
    } catch (error) {
      session.abortTransaction();
      throw new HttpException(
        error.message || 'something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      session.endSession();
    }
  }

  async updateTask(taskId: string, taskDetails: UpdateTaskDto) {
    try {
      const updatedTask = await this.taskModel.findByIdAndUpdate(
        taskId,
        { ...taskDetails },
        { lean: true, new: true },
      );
      if (taskDetails.completed === true || taskDetails.completed === false) {
        const goalId = updatedTask.goal as any;
        await this.getCompletedTaskByGoal(goalId);
      }
      return updatedTask;
    } catch (error) {
      throw new HttpException(
        error.message || 'something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteTask(taskId: string) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const task = await this.getTaskById(taskId);
      const goalId = task.goal.toString();
      await this.taskModel.findOneAndDelete({
        _id: taskId,
      });
      await this.goalService.deleteGoalTask(goalId, taskId);
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

  async deleteTaskByGoal(goalId: string) {
    try {
      await this.taskModel.deleteMany({ goal: goalId });
    } catch (error) {
      console.log(error);
    }
  }

  async getCompletedTaskByGoal(goalId: string) {
    try {
      const totalTasks = await this.taskModel.find({ goal: goalId });
      const completedTask = await this.taskModel.find({
        goal: goalId,
        completed: true,
      });
      if (totalTasks.length === completedTask.length) {
        await this.goalService.updateGoal(goalId, { completed: true });
      } else {
        await this.goalService.updateGoal(goalId, { completed: false });
      }
      return {
        totalTasks,
        completedTask,
      };
    } catch (error) {}
  }
}
