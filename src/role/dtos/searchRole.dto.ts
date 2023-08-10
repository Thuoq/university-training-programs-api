import { IsOptional } from 'class-validator';

export class SearchRoleQueryDto {
  @IsOptional()
  textSearch?: string;
}
