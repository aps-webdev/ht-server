import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Goal } from '@tasks/schemas/goals.schema';
import mongoose, { HydratedDocument } from 'mongoose';

export type Taskdocument = HydratedDocument<Task>;

@Schema({
  toObject: {
    versionKey: false,
  },
  toJSON: {
    versionKey: false,
  },
})
export class Task {
  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  frequency: string;

  @Prop({ default: false })
  reminder: boolean;

  @Prop()
  reminderTime: Date;

  @Prop({ type: { days: [Number], time: String } })
  customReminder: {
    days: [{ type: number }];
    time: string;
  };

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Goal' })
  goal: Goal;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
