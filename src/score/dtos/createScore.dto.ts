import { IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScoreDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Max(10)
  @Min(1)
  number: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  status?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  studentId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  subjectId: number;
}
