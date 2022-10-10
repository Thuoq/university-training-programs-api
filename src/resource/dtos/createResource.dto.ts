import { IsNotEmpty, IsString } from 'class-validator';

export class createResource {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
