import { IsOptional } from 'class-validator';

export class SearchTrainingProgramQueryDto {
  @IsOptional()
  textSearch?: string;
}
