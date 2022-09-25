import { IsNotEmpty, IsString } from 'class-validator';

export class createFacultyDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
