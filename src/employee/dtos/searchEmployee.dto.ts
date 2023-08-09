import { IsOptional } from 'class-validator';

export class SearchEmployeeQueryDto {
  @IsOptional()
  textSearch?: string;
}
