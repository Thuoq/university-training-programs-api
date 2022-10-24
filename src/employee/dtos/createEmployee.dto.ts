import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  employeeCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  facultyId?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  departmentId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  positionId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  sectionId?: number;
}
