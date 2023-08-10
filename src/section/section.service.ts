import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSectionDto } from './dtos/createSection.dto';
import { PostgresErrorCode } from '../prisma/postgresErrorCodes.enum';
import { SearchSectionQueryDto } from './dtos/search-section.query.dto';
import { Prisma, Section, Employee, Major } from '@prisma/client';
import { IS_ACTIVE } from '../constant/models';
import { omit } from 'lodash';

@Injectable()
export class SectionService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSection(payload: CreateSectionDto) {
    try {
      const section = await this.prismaService.section.create({ data: payload });
      return section;
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

  async getListSection(query: SearchSectionQueryDto) {
    const { textSearch } = query;

    const searchCriteria: Prisma.SectionWhereInput = textSearch
      ? {
          OR: [
            {
              name: { contains: textSearch, mode: 'insensitive' },
            },
            {
              code: { contains: textSearch, mode: 'insensitive' },
            },
            {
              faculty: {
                name: { contains: textSearch, mode: 'insensitive' },
              },
            },
          ],
        }
      : {};

    const sections = await this.prismaService.section.findMany({
      where: searchCriteria,
      include: {
        faculty: true,
        majors: {
          where: {
            isActive: IS_ACTIVE,
          },
        },
        employees: {
          where: {
            isActive: IS_ACTIVE,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
    return sections.map((section) => {
      const payload = omit(section, ['employees', 'majors']);

      return {
        ...payload,
        canDelete: this.canDeleteSection(section),
      };
    });
  }

  async getSection(id: number) {
    const section = this.prismaService.section.findFirst({
      where: {
        id: id,
      },
      include: {
        majors: {
          where: {
            isActive: IS_ACTIVE,
          },
        },
        employees: {
          where: {
            isActive: IS_ACTIVE,
          },
        },
      },
    });

    if (!section) {
      throw new HttpException('Section này đã được tạo', HttpStatus.BAD_REQUEST);
    }

    return section;
  }

  canDeleteSection(section: Section & { majors: Major[]; employees: Employee[] }) {
    const activateMajor = section.majors.filter((major) => major.isActive === IS_ACTIVE);
    const activateEmployee = section.employees.filter(
      (employee) => employee.isActive === IS_ACTIVE,
    );

    return activateMajor.length === 0 && activateEmployee.length === 0;
  }

  async deleteSection(id: number) {
    const section = await this.getSection(id);
    const canDelete = this.canDeleteSection(section);
    if (!canDelete) throw new BadRequestException();
    const today = new Date();
    return this.prismaService.section.update({
      where: {
        id,
      },
      data: {
        code: `${section.id}-${section.code}-${today.getTime()}`,
        isActive: false,
      },
    });
  }
  async updateSection(id: number, payload: CreateSectionDto) {
    await this.getSection(id);
    return this.prismaService.section.update({
      where: {
        id: id,
      },
      data: payload,
    });
  }
}
