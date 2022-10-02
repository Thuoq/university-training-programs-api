import { IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class createAcademicYearDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  @Min(2000)
  @IsNotEmpty()
  year: number;
}
