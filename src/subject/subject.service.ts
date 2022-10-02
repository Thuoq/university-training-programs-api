import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dtos/createSubject.dto';

@Injectable()
export class SubjectService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
  async createSubject(payload: CreateSubjectDto) {
    const subject = await this.prisma.subject.findFirst({
      where: {
        name: payload.name,
        id: payload.id,
      },
    });
    if (subject) {
      throw new HttpException('Đã có subject tồn tại', HttpStatus.BAD_REQUEST);
    }
    return this.prisma.subject.create({ data: payload }); 
  }
  getListSubject() {
    return this.prisma.subject.findMany();
  }
  async getSubjectByUnique(value: string | number) {
    const subject = await this.prisma.subject.findFirst({
      where: {
        OR:
          typeof value === 'string'
            ? [{ name: value }]
            : [{ id: value }],
      },
    });
    if (!subject) {
      throw new NotFoundException(`Do not found subject`);
    }
    return subject;
  }
  async deleteSubject(id: number) {
    await this.getSubjectByUnique(id);
    return this.prisma.subject.delete({
      where: {
        id,
      },
    });
  }
}
