import { IsNotEmpty, IsString } from "class-validator";

export class createSemesterDto{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    group: string;

    @IsString()
    @IsNotEmpty()
    schoolYear: string;
}