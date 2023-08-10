import { IsOptional } from 'class-validator';

export class SearchKnowledgeBlockQueryDto {
  @IsOptional()
  textSearch?: string;
}
