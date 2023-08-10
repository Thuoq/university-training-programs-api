import { IsOptional } from 'class-validator';

export class SearchFacultyQueryDto {
  @IsOptional()
  textSearch?: string;
}
