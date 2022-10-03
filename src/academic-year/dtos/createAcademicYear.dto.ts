import { IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createAcademicYearDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @Min(2000)
  @IsNotEmpty()
  year: number;
}
