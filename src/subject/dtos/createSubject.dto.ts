import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
class PrerequisiteSubjectsId {
  id: number;
}
export class CreateSubjectDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  numberOfCredits: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  numberPrerequisiteCredits: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  numberOfTeachingHours: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  numberOfCreditsRequirement: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  coefficient: number;
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrerequisiteSubjectsId)
  prerequisiteSubjectsId?: PrerequisiteSubjectsId[];
}
