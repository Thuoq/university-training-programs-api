import { IsNotEmpty, IsString } from "class-validator";


export class createGradeDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}