import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AcademicYearService } from 'src/academic-year/academic-year.service';
import { MajorService } from 'src/major/major.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrainingProgramDto } from './dtos/createTrainingProgram.dto';

@Injectable()
export class TrainingProgramService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly majorService: MajorService,
        private readonly academicYearService: AcademicYearService,
    ) {}

    async createTrainingProgram(payload: CreateTrainingProgramDto){
        await this.majorService.getMajorUnique(payload.marjorId),
        await this.academicYearService.getAcademicYear(payload.academicYearId)
        return this.prismaService.trainingProgram.create({data: payload});
    }

    getListTrainingProgram(){
        return this.prismaService.trainingProgram.findMany();
    }
    
    async getTrainingProgramByUnique(id: number){
        const trainingProgram = await this.prismaService.trainingProgram.findFirst({
            where: {
                id: id,
            },
        });

        if(!trainingProgram){
            throw new NotFoundException('Không có chương trình đào tạo');
        }
        return trainingProgram;
    }

   async deleteTrainingProgram(id: number){
        await this.getTrainingProgramByUnique(id);
        return this.prismaService.trainingProgram.delete({
            where: {
                id,
            },
        });
    }
}
