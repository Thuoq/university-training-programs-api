import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createAcademicYearDto } from './dtos/createAcademicYear.dto';

@Injectable()
export class AcademicYearService {
  constructor(private readonly prismaService: PrismaService) {}
  createAcademicYear(payload: createAcademicYearDto) {
    return this.prismaService.academicYear.create({
      data: payload,
    });
  }
  getListAcademicYear() {
    return this.prismaService.academicYear.findMany();
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
    await this.getAcademicYear(id);
    return this.prismaService.academicYear.delete({
      where: {
        id,
      },
    });
  }
}
