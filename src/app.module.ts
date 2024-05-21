import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { env } from 'process';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@users/users.module';
import { GoalsModule } from '@tasks/goals.module';
import { TasksModule } from '@goals/tasks.module';
import { AuthModule } from '@auth/auth.module';
import { ChangeLogsModule } from './change-logs/change-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(env.CONNECTION_URI),
    UsersModule,
    GoalsModule,
    TasksModule,
    AuthModule,
    ChangeLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
