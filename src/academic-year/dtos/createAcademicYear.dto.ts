import { IsDate, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createAcademicYearDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  startYear: Date;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  finishYear: Date;
}
