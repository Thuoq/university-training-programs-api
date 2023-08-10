import { IsOptional } from 'class-validator';

export class SearchSectionQueryDto {
  @IsOptional()
  textSearch?: string;
}
