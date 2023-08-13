import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsNumber()
  facultyId?: number;

  @IsOptional()
  @IsNumber()
  departmentId?: number;

  @IsNotEmpty()
  @IsInt({
    each: true,
  })
  @Min(1, {
    each: true,
  })
  positionIds: number[];

  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @IsNumber()
  @IsOptional()
  sectionId?: number;
}
