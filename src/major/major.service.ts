import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMajorDto } from './dtos/createMajor.dto';
import { PostgresErrorCode } from '../prisma/postgresErrorCodes.enum';
import { SearchMajorQueryDto } from './dtos/search-major.query.dto';

@Injectable()
export class MajorService {
  constructor(private readonly prisma: PrismaService) {}
  getListMajor(query: SearchMajorQueryDto) {
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
              section: {
                name: { contains: textSearch },
              },
            },
            {
              faculty: {
                name: { contains: textSearch },
              },
            },
          ],
        }
      : {};

    return this.prisma.major.findMany({
      where: searchCriteria,
      include: {
        faculty: true,
        section: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async getMajorUnique(value: number) {
    const major = await this.prisma.major.findUnique({
      where: {
        id: value,
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
