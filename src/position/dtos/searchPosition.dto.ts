import { IsOptional } from 'class-validator';

export class SearchPositionQueryDto {
  @IsOptional()
  textSearch?: string;
}
