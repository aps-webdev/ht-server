import { Task } from '@goals/schemas/tasks.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@users/schemas/users.schema';
import mongoose, { HydratedDocument } from 'mongoose';

export type Goaldocument = HydratedDocument<Goal>;

@Schema({
  toObject: {
    versionKey: false,
  },
  toJSON: {
    versionKey: false,
  },
})
export class Goal {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  minTimeLine: string;

  @Prop({ required: true })
  maxTimeLine: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] })
  tasks: Task[];
}

export const GoalSchema = SchemaFactory.createForClass(Goal);
