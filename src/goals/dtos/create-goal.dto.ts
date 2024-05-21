import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  minTimeLine: string;

  @IsString()
  @IsNotEmpty()
  maxTimeLine: string;
}
