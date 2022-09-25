import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  employeeCode: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  phoneNumber?: string;

  @IsNotEmpty()
  @IsNumber()
  facultyId: number;

  @IsNotEmpty()
  @IsNumber()
  departmentId: number;

  @IsNotEmpty()
  @IsNumber()
  positionId: number;
}
