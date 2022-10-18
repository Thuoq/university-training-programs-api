import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSectionDto } from './dtos/createSection.dto';

@Injectable()
export class SectionService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSection(payload: CreateSectionDto) {
    return this.prismaService.section.create({ data: payload });
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
}
