import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
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
  @IsDateString()
  @IsNotEmpty()
  startYear: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  finishYear: Date;
}
