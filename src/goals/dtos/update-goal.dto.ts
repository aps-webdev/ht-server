import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateGoalDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  minTimeLine?: string;

  @IsString()
  @IsOptional()
  maxTimeLine?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
