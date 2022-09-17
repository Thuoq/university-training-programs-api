import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dtos/createStudent.dto';
import { MajorService } from '../major/major.service';

@Injectable()
export class StudentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly majorService: MajorService,
  ) {}
  async createStudent(payload: CreateStudentDto) {
    const student = await this.prisma.student.findFirst({
      where: {
        studentCode: payload.studentCode,
        email: payload.email,
      },
    });
    if (student) {
      throw new HttpException('Đã có student tồn tại', HttpStatus.BAD_REQUEST);
    }
    await this.majorService.getMajorUnique(payload.majorId);
    return this.prisma.student.create({ data: payload });
  }
  getListStudent() {
    return this.prisma.student.findMany();
  }
  async getStudentByUnique(value: string | number) {
    const student = await this.prisma.student.findFirst({
      where: {
        OR:
          typeof value === 'string'
            ? [{ email: value }, { studentCode: value }]
            : [{ id: value }],
      },
    });
    if (!student) {
      throw new NotFoundException(`Do not found student`);
    }
    return student;
  }
  async deleteStudent(id: number) {
    await this.getStudentByUnique(id);
    return this.prisma.student.delete({
      where: {
        id,
      },
    });
  }
}
