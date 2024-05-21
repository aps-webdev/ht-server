import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CustomReminder } from './create-task.dto';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  quantity: number;

  @IsString()
  @IsOptional()
  frequency: string;

  @IsBoolean()
  @IsOptional()
  completed: boolean;

  @IsBoolean()
  @IsOptional()
  reminder: boolean;

  @IsDate()
  @IsOptional()
  reminderTime: Date;

  @IsOptional()
  customReminder: CustomReminder;
}
