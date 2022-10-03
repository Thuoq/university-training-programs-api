import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createKnowledgeBlockDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
