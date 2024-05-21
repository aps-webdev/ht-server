import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@users/schemas/users.schema';
import mongoose, { HydratedDocument } from 'mongoose';

export type ChangeLogDocument = HydratedDocument<ChangeLog>;

enum Tables {
  USERS = 'users',
  GOALS = 'goals',
  TASKS = 'tasks',
}

enum Actions {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
}

interface Delta {
  previousState: JSON;
  nextState: JSON;
}

@Schema({
  toObject: {
    versionKey: false,
  },
  toJSON: {
    versionKey: false,
  },
})
export class ChangeLog {
  @Prop({ required: true, enum: Tables })
  type: Tables;

  @Prop({ type: String, required: true })
  typeId: string;

  @Prop({ type: String, required: true, enum: Actions })
  action: Actions;

  @Prop({
    required: true,
    type: {
      previousState: JSON,
      nextState: JSON,
    },
  })
  delta: Delta;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const ChangeLogSchema = SchemaFactory.createForClass(ChangeLog);
