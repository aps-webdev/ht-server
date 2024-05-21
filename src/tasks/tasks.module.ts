import { Module, forwardRef } from '@nestjs/common';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task, TaskSchema } from '@goals/schemas/tasks.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalsModule } from '@tasks/goals.module';

@Module({
  imports: [
    forwardRef(() => GoalsModule),
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
