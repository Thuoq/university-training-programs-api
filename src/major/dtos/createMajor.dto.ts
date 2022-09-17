import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMajorDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
