import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSectionDto } from './dtos/createSection.dto';
import { PostgresErrorCode } from '../prisma/postgresErrorCodes.enum';

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

  getListSection() {
    return this.prismaService.section.findMany({
      include: {
        faculty: true,
      },
    });
  }

  async getSection(id: number) {
    const section = this.prismaService.section.findFirst({
      where: {
        id: id,
      },
    });

    if (!section) {
      throw new HttpException('Section này đã được tạo', HttpStatus.BAD_REQUEST);
    }

    return section;
  }

  async deleteSection(id: number) {
    await this.getSection(id);
    return this.prismaService.section.delete({
      where: {
        id,
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
