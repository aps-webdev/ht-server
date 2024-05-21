import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export interface CustomReminder {
  days: number[];
  time: string;
}

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  frequency: string;

  @IsString()
  @IsOptional()
  reminderTime: string;

  @IsOptional()
  customReminder: CustomReminder;
}
