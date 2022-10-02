import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSubjectDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    numberOfCredits: number;

    @IsNumber()
    @IsNotEmpty()
    numberPrerequisiteCredits: number;

}