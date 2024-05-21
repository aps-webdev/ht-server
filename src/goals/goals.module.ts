import { Module, forwardRef } from '@nestjs/common';

import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Goal, GoalSchema } from './schemas/goals.schema';
import { UsersModule } from '@users/users.module';
import { TasksModule } from '@goals/tasks.module';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => TasksModule),
    MongooseModule.forFeature([
      {
        name: Goal.name,
        schema: GoalSchema,
      },
    ]),
  ],
  controllers: [GoalsController],
  providers: [GoalsService],
  exports: [GoalsService],
})
export class GoalsModule {}
