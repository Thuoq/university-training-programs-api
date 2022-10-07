import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubjectService } from 'src/subject/subject.service';
import { TrainingProgramService } from 'src/training-program/training-program.service';
import { CreateTrainingProgramContentDto } from './dtos/createTrainingProgramContent.dto';

@Injectable()
export class TrainingProgramContentService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly trainingProgramService: TrainingProgramService,
        private readonly subjectService: SubjectService,
    ){}

    async createTrainingProgramContent(payload: CreateTrainingProgramContentDto){
        await this.trainingProgramService.getTrainingProgramByUnique(payload.trainingProgramId);
        await this.subjectService.getSubjectById(payload.subjectId);
        const trainingProgram = await this.prismaService.trainingProgramContent.findFirst({
            where: {
                trainingProgramId: payload.trainingProgramId,
                subjectId: payload.subjectId,
            },
        });

        if(trainingProgram){
            throw new HttpException('Chương trình học đã có môn này', HttpStatus.BAD_REQUEST);
        }

        return this.prismaService.trainingProgramContent.create({data: payload});
    }

    getListTrainingProgramContent(){
        return this.prismaService.trainingProgramContent.findMany();
    }

    async getTrainingProgramContent(id: number){
        const trainingProgramContent = this.prismaService.trainingProgramContent.findFirst({
            where:{
                id: id,
            }
        });

        return trainingProgramContent
    }

    async deleteTrainingProgramContent(id: number){
        await this.getTrainingProgramContent(id);
        return this.prismaService.trainingProgramContent.delete({
            where: {
                id,
            }
        });
    }
}
