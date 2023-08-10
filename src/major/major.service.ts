import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMajorDto } from './dtos/createMajor.dto';
import { PostgresErrorCode } from '../prisma/postgresErrorCodes.enum';
import { SearchMajorQueryDto } from './dtos/search-major.query.dto';
import { Prisma, Major, TrainingProgram } from '@prisma/client';
import { IS_ACTIVE } from '../constant/models';
import { omit } from 'lodash';
@Injectable()
export class MajorService {
  constructor(private readonly prisma: PrismaService) {}
  async getListMajor(query: SearchMajorQueryDto) {
    const { textSearch } = query;

    const searchCriteria: Prisma.MajorWhereInput = textSearch
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

    const majors = await this.prisma.major.findMany({
      where: searchCriteria,
      include: {
        faculty: true,
        section: true,
        trainingPrograms: {
          where: {
            isActive: IS_ACTIVE,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    return majors.map((major) => {
      const canDelete = this.canDeleteMajor(major);
      return {
        ...omit(major, ['trainingPrograms']),
        canDelete,
      };
    });
  }

  canDeleteMajor(major: Major & { trainingPrograms: TrainingProgram[] }) {
    const trainingProgramsActivate = major.trainingPrograms.filter(
      (element) => element.isActive,
    );
    return trainingProgramsActivate.length === 0;
  }

  async getMajorUnique(value: number) {
    const major = await this.prisma.major.findUnique({
      where: {
        id: value,
      },
      include: {
        trainingPrograms: {
          where: {
            isActive: IS_ACTIVE,
          },
        },
      },
    });
    if (!major) {
      throw new NotFoundException('Ngành này chưa được tạo');
    }
    return major;
  }
  async createMajor(payload: CreateMajorDto) {
    try {
      const major = await this.prisma.major.create({ data: payload });
      return major;
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
  async deleteMajor(id: number) {
    const today = new Date();
    const major = await this.getMajorUnique(id);

    const canDelete = this.canDeleteMajor(major);

    if (!canDelete) throw new BadRequestException();
    return this.prisma.major.update({
      where: {
        id,
      },
      data: {
        code: `${major.id}-${major.code}-${today.getTime()}`,
        isActive: false,
      },
    });
  }
  async updateMajor(id: number, payload: CreateMajorDto) {
    await this.getMajorUnique(id);
    return this.prisma.major.update({
      where: {
        id: id,
      },
      data: payload,
    });
  }
}
