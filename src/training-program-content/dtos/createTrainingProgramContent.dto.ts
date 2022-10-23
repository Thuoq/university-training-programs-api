import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTrainingProgramContentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  subjectId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  knowledgeBlockId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  trainingProgramId: number;
}
