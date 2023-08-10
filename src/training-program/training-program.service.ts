import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AcademicYearService } from 'src/academic-year/academic-year.service';
import { MajorService } from 'src/major/major.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrainingProgramDto } from './dtos/createTrainingProgram.dto';
import { PostgresErrorCode } from '../prisma/postgresErrorCodes.enum';
import { SearchTrainingProgramQueryDto } from './dtos/searchTrainingProgram.dto';

@Injectable()
export class TrainingProgramService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly majorService: MajorService,
    private readonly academicYearService: AcademicYearService,
  ) {}

  async createTrainingProgram(payload: CreateTrainingProgramDto) {
    try {
      const major = this.majorService.getMajorUnique(payload.marjorId);
      const academic = this.academicYearService.getAcademicYear(payload.academicYearId);
      await Promise.all([major, academic]);
      const trainingProgram = await this.prismaService.trainingProgram.create({
        data: payload,
      });
      return trainingProgram;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          `Duplicate field ${error.meta.target[0]}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  getListTrainingProgram(query: SearchTrainingProgramQueryDto) {
    const { textSearch } = query;

    const searchCriteria = textSearch
      ? {
          OR: [
            {
              name: { contains: textSearch },
            },
            {
              code: { contains: textSearch },
            },
            {
              marjor: {
                name: { contains: textSearch },
              },
            },
            {
              academicYear: {
                name: { contains: textSearch },
              },
            },
          ],
        }
      : {};
    return this.prismaService.trainingProgram.findMany({
      orderBy: {
        id: 'desc',
      },
      where: searchCriteria,
      include: {
        marjor: true,
        academicYear: true,
        trainingProgramContents: {
          include: {
            subject: true,
          },
        },
      },
    });
  }

  async getTrainingProgramByUnique(id: number) {
    const trainingProgram = await this.prismaService.trainingProgram.findFirst({
      where: {
        id: id,
      },
      include: {
        marjor: true,
        academicYear: true,
        trainingProgramContents: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!trainingProgram) {
      throw new NotFoundException('Không có chương trình đào tạo');
    }
    return trainingProgram;
  }

  async deleteTrainingProgram(id: number) {
    const trainingProgram = await this.getTrainingProgramByUnique(id);
    const today = new Date();
    return this.prismaService.trainingProgram.update({
      where: {
        id,
      },
      data: {
        code: `${trainingProgram.id}-${trainingProgram.code}-${today.getTime()}`,
        isActive: false,
      },
    });
  }
  async updateTrainingProgram(id: number, payload: CreateTrainingProgramDto) {
    await this.getTrainingProgramByUnique(id);
    return this.prismaService.trainingProgram.update({
      where: {
        id: id,
      },
      data: payload,
    });
  }
}
