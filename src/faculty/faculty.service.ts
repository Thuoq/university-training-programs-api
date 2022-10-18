import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createFacultyDto } from './dtos/createFaculty.dto';

@Injectable()
export class FacultyService {
  constructor(private readonly prismaService: PrismaService) { }
  createFaculty(payload: createFacultyDto) {
    return this.prismaService.faculty.create({
      data: payload,
    });
  }
  getListFaculty() {
    return this.prismaService.faculty.findMany();
  }
  async getFaculty(id: number) {
    const faculty = await this.prismaService.faculty.findUnique({
      where: {
        id,
      },
    });
    if (!faculty) {
      throw new NotFoundException('Không tìm thấy faculty');
    }
    return faculty;
  }
  async deleteFaculty(id: number) {
    await this.getFaculty(id);
    return this.prismaService.faculty.delete({
      where: {
        id,
      },
    });
  }
  async updateFaculty(id: number, payload: createFacultyDto) {
    await this.getFaculty(id);
    return this.prismaService.faculty.update({
      where: {
        id: id,
      },
      data: payload
    });
  }
}
