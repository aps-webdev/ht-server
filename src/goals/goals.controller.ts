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
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dtos/create-goal.dto';
import { Goal } from './schemas/goals.schema';
import { UpdateGoalDto } from './dtos/update-goal.dto';

@Controller('goals')
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Get()
  async getGoals(): Promise<Goal[]> {
    return this.goalsService.getGoals();
  }

  @Get('/:goalId')
  async getGoalById(@Param('goalId') goalId: string): Promise<Goal> {
    return this.goalsService.getGoalById(goalId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/:userId')
  async createGoal(
    @Body() goal: CreateGoalDto,
    @Param('userId') userId: string,
  ): Promise<Goal> {
    return this.goalsService.createGoal(userId, goal);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Put('/update/:goalId')
  async updateGoal(
    @Param('goalId') goalId: string,
    @Body() goalDetails: UpdateGoalDto,
  ) {
    return this.goalsService.updateGoal(goalId, goalDetails);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/delete/:goalId')
  async deleteGoal(@Param('goalId') goalId: string) {
    return this.goalsService.deleteGoal(goalId);
  }
}
