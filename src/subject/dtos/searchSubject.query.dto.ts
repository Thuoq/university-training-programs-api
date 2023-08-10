import { IsOptional } from 'class-validator';

export class SearchSubjectQueryDto {
  @IsOptional()
  textSearch?: string;
}
