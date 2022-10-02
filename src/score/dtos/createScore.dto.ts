import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreateScoreDto {
  @IsNotEmpty()
  @IsNumber()
  @Max(10)
  @Min(1)
  number: number;

  @IsOptional()
  @IsNumber()
  status?: number;

  @IsNotEmpty()
  @IsNumber()
  studentId: number;

  @IsNumber()
  @IsNotEmpty()
  subjectId: number;
}
