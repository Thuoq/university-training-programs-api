import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrainingProgramContentDto } from './dtos/createTrainingProgramContent.dto';

@Injectable()
export class TrainingProgramContentService {
  constructor(private readonly prismaService: PrismaService) {}

  getListTrainingProgramContent() {
    return this.prismaService.trainingProgramContent;
  }

  async getTrainingProgramContent(trainingProgramId: number) {
    const trainingProgramContent = this.prismaService.trainingProgramContent.findMany({
      where: {
        trainingProgramId: trainingProgramId,
      },
      include: {
        trainingProgram: true,
      },
    });

    return trainingProgramContent;
  }

  async deleteManyTrainingProgramContent(trainingProgramId: number) {
    await this.getTrainingProgramContent(trainingProgramId);
    return this.prismaService.trainingProgramContent.deleteMany({
      where: {
        trainingProgramId,
      },
    });
  }

  createManyTrainingProgramContent(data: CreateTrainingProgramContentDto[]) {
    return this.prismaService.trainingProgramContent.createMany({
      data,
    });
  }
}
