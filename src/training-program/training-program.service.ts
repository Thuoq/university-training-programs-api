import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrainingProgramDto } from './dtos/createTrainingProgram.dto';

@Injectable()
export class TrainingProgramService {
    constructor(private readonly prismaService: PrismaService) {}

    async createTrainingProgram(payload: CreateTrainingProgramDto){
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
