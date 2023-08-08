import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
export class PrerequisiteSubjectsId {
  id: number;
}
export class CreateSubjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  @Type(() => Number)
  numberOfCredits?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  numberPrerequisiteCredits?: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  numberOfTeachingHours: number;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  coefficient: number;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrerequisiteSubjectsId)
  prerequisiteSubjectsId?: PrerequisiteSubjectsId[];
}
