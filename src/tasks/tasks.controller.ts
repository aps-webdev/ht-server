import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/:goalId')
  async createTask(
    @Param('goalId') goalId: string,
    @Body() taskDetails: CreateTaskDto,
  ) {
    return await this.tasksService.createTask(goalId, taskDetails);
  }

  @Get()
  async getAllTasks() {
    return await this.tasksService.getAllTasks();
  }

  @Get('/:taskId')
  async getTaskById(@Param('taskId') taskId: string) {
    return await this.tasksService.getTaskById(taskId);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Put('/update/:taskId')
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() taskDetails: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(taskId, taskDetails);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/delete/:taskId')
  async deleteGoal(@Param('taskId') taskId: string) {
    return this.tasksService.deleteTask(taskId);
  }
}
