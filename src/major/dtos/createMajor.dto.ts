import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMajorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
