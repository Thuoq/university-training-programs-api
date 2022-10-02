import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dtos/createSubject.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Subject } from '@prisma/client';
@Injectable()
export class SubjectService {
  constructor(private readonly prismaService: PrismaService) {}
  async createSubjectService(payload: CreateSubjectDto): Promise<Subject> {
    const { prerequisiteSubjectsId, ...body } = payload;
    if (prerequisiteSubjectsId) {
      const prerequisiteSubjectsProcessing = payload.prerequisiteSubjectsId.map(
        (subject) => this.getSubjectById(subject.id),
      );
      await Promise.all(prerequisiteSubjectsProcessing);
    }
    return this.prismaService.subject.create({
      data: {
        ...body,
        prerequisiteSubjects: { connect: prerequisiteSubjectsId },
      },
    });
  }
  async getSubjectById(id: number): Promise<Subject> {
    const subject = await this.prismaService.subject.findUnique({
      where: {
        id,
      },
      include: {
        prerequisiteSubjects: true,
      },
    });
    if (!subject) {
      throw new NotFoundException('Subject không đúng');
    }
    return subject;
  }
  getAllSubject(): Promise<Subject[]> {
    return this.prismaService.subject.findMany({
      include: {
        prerequisiteSubjects: true,
      },
    });
  }
  async deleteSubject(id: number): Promise<Subject> {
    await this.getSubjectById(id);
    return this.prismaService.subject.delete({
      where: {
        id,
      },
    });
  }
}
