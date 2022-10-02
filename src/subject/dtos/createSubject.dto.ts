import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
class PrerequisiteSubjectsId {
  id: number;
}
export class CreateSubjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNumber()
  @IsNotEmpty()
  numberOfCredits: number;

  @IsNumber()
  @IsNotEmpty()
  numberPrerequisiteCredits: number;

  @IsNumber()
  @IsNotEmpty()
  numberOfTeachingHours: number;

  @IsNumber()
  @IsNotEmpty()
  numberOfCreditsRequirement: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrerequisiteSubjectsId)
  prerequisiteSubjectsId?: PrerequisiteSubjectsId[];
}
