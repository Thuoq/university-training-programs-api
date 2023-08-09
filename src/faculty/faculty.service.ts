import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createFacultyDto } from './dtos/createFaculty.dto';
import { PostgresErrorCode } from '../prisma/postgresErrorCodes.enum';
import { SearchFacultyQueryDto } from './dtos/search-faculty.query.dto';
import { Faculty, Section } from '@prisma/client';

@Injectable()
export class FacultyService {
  constructor(private readonly prismaService: PrismaService) {}
  async createFaculty(payload: createFacultyDto) {
    try {
      const faculty = await this.prismaService.faculty.create({
        data: payload,
      });
      return faculty;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException(`Trùng Mã Khoa`);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getListFaculty(query: SearchFacultyQueryDto) {
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

    const listFaculty = await this.prismaService.faculty.findMany({
      where: searchCriteria,
      orderBy: {
        id: 'desc',
      },
      include: {
        sections: {
          where: {
            isActive: true,
          },
        },
      },
    });

    return listFaculty.map((faculty) => ({
      ...faculty,
      canDelete: this.canDeleteFaculty(faculty),
    }));
  }

  canDeleteFaculty(faculty: Faculty & { sections: Section[] }) {
    const sectionsActive = faculty.sections.filter((section) => section.isActive);

    return sectionsActive.length === 0;
  }

  async getFaculty(id: number) {
    const faculty = await this.prismaService.faculty.findUnique({
      where: {
        id,
      },
      include: {
        sections: {
          where: {
            isActive: true,
          },
        },
      },
    });
    if (!faculty) {
      throw new NotFoundException('Không tìm thấy faculty');
    }
    return faculty;
  }
  async deleteFaculty(id: number) {
    const faculty = await this.getFaculty(id);

    const canDelete = this.canDeleteFaculty(faculty);

    if (!canDelete) throw new BadRequestException('KO dc xoa');

    const today = new Date();
    return this.prismaService.faculty.update({
      where: {
        id,
      },
      data: {
        code: `${faculty.id}-${faculty.code}-${today.getTime()}`,
        isActive: false,
      },
    });
  }
  async updateFaculty(id: number, payload: createFacultyDto) {
    await this.getFaculty(id);
    return this.prismaService.faculty.update({
      where: {
        id: id,
      },
      data: payload,
    });
  }
}
