import { IsOptional } from 'class-validator';

export class SearchAcademicYearQueryDto {
  @IsOptional()
  textSearch?: string;
}
