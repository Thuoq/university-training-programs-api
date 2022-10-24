import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dtos/createSubject.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Subject } from '@prisma/client';
import { PostgresErrorCode } from '../prisma/postgresErrorCodes.enum';
@Injectable()
export class SubjectService {
  constructor(private readonly prismaService: PrismaService) {}
  async createSubjectService(payload: CreateSubjectDto): Promise<Subject> {
    try {
      const { prerequisiteSubjectsId, ...body } = payload;
      if (prerequisiteSubjectsId) {
        const prerequisiteSubjectsProcessing = payload.prerequisiteSubjectsId.map(
          (subject) => this.getSubjectById(subject.id),
        );
        await Promise.all(prerequisiteSubjectsProcessing);
      }
      const subject = await this.prismaService.subject.create({
        data: {
          ...body,
          prerequisiteSubjects: { connect: prerequisiteSubjectsId },
        },
      });
      return subject;
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
