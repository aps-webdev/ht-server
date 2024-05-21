import { Module } from '@nestjs/common';
import { ChangeLogsController } from './change-logs.controller';
import { ChangeLogsService } from './change-logs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChangeLog, ChangeLogSchema } from './schemas/change-logs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ChangeLog.name,
        schema: ChangeLogSchema,
      },
    ]),
  ],
  controllers: [ChangeLogsController],
  providers: [ChangeLogsService],
})
export class ChangeLogsModule {}
