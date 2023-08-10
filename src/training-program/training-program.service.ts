import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AcademicYearService } from 'src/academic-year/academic-year.service';
import { MajorService } from 'src/major/major.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrainingProgramDto } from './dtos/createTrainingProgram.dto';
import { PostgresErrorCode } from '../prisma/postgresErrorCodes.enum';
import { SearchTrainingProgramQueryDto } from './dtos/searchTrainingProgram.dto';
import { Prisma, TrainingProgramContent, TrainingProgram } from '@prisma/client';
import { IS_ACTIVE } from '../constant/models';
import { omit } from 'lodash';
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

  async getListTrainingProgram(query: SearchTrainingProgramQueryDto) {
    const { textSearch } = query;

    const searchCriteria: Prisma.TrainingProgramWhereInput = textSearch
      ? {
          OR: [
            {
              name: { contains: textSearch, mode: 'insensitive' },
            },
            {
              code: { contains: textSearch, mode: 'insensitive' },
            },
          ],
        }
      : {};
    const trainingPrograms = await this.prismaService.trainingProgram.findMany({
      orderBy: {
        id: 'desc',
      },
      where: searchCriteria,
      include: {
        marjor: true,
        academicYear: true,
        trainingProgramContents: {
          where: {
            isActive: IS_ACTIVE,
          },
          include: {
            subject: true,
          },
        },
      },
    });

    return trainingPrograms.map((training) => ({
      ...omit(training, ['trainingProgramContents']),
      canDelete: this.canDeleteTrainingProgram(training),
    }));
  }

  canDeleteTrainingProgram(
    trainingProgram: TrainingProgram & {
      trainingProgramContents: TrainingProgramContent[];
    },
  ) {
    const trainingProgramContentActive = trainingProgram.trainingProgramContents.filter(
      (content) => content.isActive === IS_ACTIVE,
    );
    return trainingProgramContentActive.length === 0;
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
          where: {
            isActive: IS_ACTIVE,
          },
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
    const canDelete = this.canDeleteTrainingProgram(trainingProgram);

    if (!canDelete) throw new BadRequestException();
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
