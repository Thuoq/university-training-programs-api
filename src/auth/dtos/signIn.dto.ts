import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employeeCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
