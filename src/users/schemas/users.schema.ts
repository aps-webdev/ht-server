import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Goal } from '@tasks/schemas/goals.schema';
import mongoose, { HydratedDocument } from 'mongoose';

export type Userdocument = HydratedDocument<User>;

@Schema({
  toObject: {
    versionKey: false,
  },
  toJSON: {
    versionKey: false,
  },
})
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }] })
  goals: Goal[];
}

export const UserSchema = SchemaFactory.createForClass(User);
