import { IsNotEmpty, IsNumber} from "class-validator";

export class createKnowledgeBlocksDto {
    @IsNumber()
    @IsNotEmpty()
    subjectId: number;

    @IsNumber()
    @IsNotEmpty()
    educationProgramId: number;
}