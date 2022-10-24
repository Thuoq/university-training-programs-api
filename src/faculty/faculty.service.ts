import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createFacultyDto } from './dtos/createFaculty.dto';
import { PostgresErrorCode } from '../prisma/postgresErrorCodes.enum';

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
        throw new HttpException(
          `Duplicate field ${error.meta.target[0]}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
      data: payload,
    });
  }
}
