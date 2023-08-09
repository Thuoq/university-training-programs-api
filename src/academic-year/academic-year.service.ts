import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createAcademicYearDto } from './dtos/createAcademicYear.dto';
import { PostgresErrorCode } from '../prisma/postgresErrorCodes.enum';
import { SearchAcademicYearQueryDto } from './dtos/search-academic-year.query.dto';

@Injectable()
export class AcademicYearService {
  constructor(private readonly prismaService: PrismaService) {}
  async createAcademicYear(payload: createAcademicYearDto) {
    try {
      const academic = await this.prismaService.academicYear.create({
        data: payload,
      });
      return academic;
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

  getListAcademicYear(query: SearchAcademicYearQueryDto) {
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
          ],
        }
      : {};

    return this.prismaService.academicYear.findMany({
      where: searchCriteria,
      orderBy: {
        id: 'desc',
      },
    });
  }

  async getAcademicYear(id: number) {
    const academicYear = await this.prismaService.academicYear.findUnique({
      where: {
        id,
      },
    });
    if (!academicYear) {
      throw new NotFoundException('Không tìm thấy Academic year');
    }
    return academicYear;
  }

  async deleteAcademicYear(id: number) {
    const accademy = await this.getAcademicYear(id);
    const today = new Date();
    return this.prismaService.academicYear.update({
      where: {
        id,
      },
      data: {
        code: `${accademy.id}-${accademy.code}-${today.getTime()}`,
        isActive: false,
      },
    });
  }

  async updateAcademicYear(id: number, payload: createAcademicYearDto) {
    await this.getAcademicYear(id);
    return this.prismaService.academicYear.update({
      where: {
        id: id,
      },
      data: payload,
    });
  }
}
