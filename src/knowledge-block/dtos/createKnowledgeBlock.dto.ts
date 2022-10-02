import { IsNotEmpty, IsString } from 'class-validator';

export class createKnowledgeBlockDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
