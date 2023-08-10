import { IsOptional } from 'class-validator';

export class SearchMajorQueryDto {
  @IsOptional()
  textSearch?: string;
}
