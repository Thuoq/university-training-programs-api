import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrainingProgramContentDto } from './dtos/createTrainingProgramContent.dto';

@Injectable()
export class TrainingProgramContentService {
    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async createTrainingProgramContent(payload: CreateTrainingProgramContentDto[]) {
        return this.prismaService.trainingProgramContent.createMany({ data: payload });
    }

    getListTrainingProgramContent() {
        return this.prismaService.trainingProgramContent.findMany();
    }

    async getTrainingProgramContent(trainingProgramId: number) {
        const trainingProgramContent = this.prismaService.trainingProgramContent.findMany({
            where: {
                trainingProgramId: trainingProgramId,
            },
            include: {
                subject: true,
                knowledgeBlock: true,
            }
        });

        if (!trainingProgramContent) {
            throw new HttpException("Duplicate field code", HttpStatus.BAD_REQUEST);
        }

        return trainingProgramContent;
    }

    async deleteTrainingProgramContent(trainingProgramId: number) {
        await this.getTrainingProgramContent(trainingProgramId);
        return this.prismaService.trainingProgramContent.deleteMany({
            where: {
                trainingProgramId: trainingProgramId,
            }
        });
    }
}
