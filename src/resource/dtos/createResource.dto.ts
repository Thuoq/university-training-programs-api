import { IsNotEmpty, IsString } from 'class-validator';

export class createResourceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
