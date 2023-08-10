import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubjectDto, PrerequisiteSubjectsId } from './dtos/createSubject.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PostgresErrorCode } from '../prisma/postgresErrorCodes.enum';
import { SearchSubjectQueryDto } from './dtos/searchSubject.query.dto';
import { Prisma, Subject, TrainingProgramContent } from '@prisma/client';
import { IS_ACTIVE } from '../constant/models';
import { omit } from 'lodash';
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
  async getSubjectById(id: number) {
    const subject = await this.prismaService.subject.findUnique({
      where: {
        id,
      },
      include: {
        prerequisiteSubjects: true,
        trainingProgramContents: {
          where: {
            isActive: IS_ACTIVE,
          },
        },
      },
    });
    if (!subject) {
      throw new NotFoundException('Subject không đúng');
    }
    return subject;
  }
  async getAllSubject(query: SearchSubjectQueryDto): Promise<Subject[]> {
    const { textSearch } = query;

    const searchCriteria: Prisma.SubjectWhereInput = textSearch
      ? {
          OR: [
            {
              name: { contains: textSearch, mode: 'insensitive' },
            },
            {
              code: { contains: textSearch, mode: 'insensitive' },
            },
            {
              prerequisiteSubjects: {
                some: {
                  code: { contains: textSearch, mode: 'insensitive' },
                },
              },
            },
          ],
        }
      : {};

    const subjects = await this.prismaService.subject.findMany({
      where: searchCriteria,
      include: {
        prerequisiteSubjects: true,
        trainingProgramContents: {
          where: {
            isActive: IS_ACTIVE,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    return subjects.map((sub) => ({
      ...omit(sub, ['trainingProgramContents']),
      canDelete: this.canDeleteSubject(sub),
    }));
  }

  canDeleteSubject(
    subject: Subject & { trainingProgramContents: TrainingProgramContent[] },
  ) {
    const contentActive = subject.trainingProgramContents.filter(
      (training) => training.isActive === IS_ACTIVE,
    );
    return contentActive.length === 0;
  }
  async deleteSubject(id: number): Promise<Subject> {
    const subject = await this.getSubjectById(id);
    const canDelete = this.canDeleteSubject(subject);
    if (!canDelete) throw new BadRequestException();
    const today = new Date();
    return this.prismaService.subject.update({
      where: {
        id,
      },
      data: {
        code: `${subject.id}-${subject.code}-${today.getTime()}`,
        isActive: false,
      },
    });
  }

  async updatePrerequisiteSubject(
    transaction,
    subjectId: number,
    payload: CreateSubjectDto,
  ) {
    return transaction.subject.update({
      where: {
        id: subjectId,
      },
      data: {
        prerequisiteSubjects: { connect: payload.prerequisiteSubjectsId },
      },
    });
  }
  disConnectPrerequisiteSubject(
    transaction,
    subjectId: number,
    subjectIdsDisconnect: PrerequisiteSubjectsId[],
  ) {
    return transaction.subject.update({
      where: {
        id: subjectId,
      },
      data: {
        prerequisiteSubjects: { disconnect: subjectIdsDisconnect },
      },
    });
  }
  async updateSubject(id: number, payload: CreateSubjectDto) {
    const currentSubject = await this.getSubjectById(id);
    const { prerequisiteSubjectsId, ...body } = payload;
    const subjectUpdated = await this.prismaService.$transaction(async (transaction) => {
      if (payload.prerequisiteSubjectsId) {
        await this.disConnectPrerequisiteSubject(
          transaction,
          id,
          currentSubject.prerequisiteSubjects.map((el) => ({ id: el.id })),
        );
        await this.updatePrerequisiteSubject(transaction, id, payload);
      }
      return transaction.subject.update({
        where: {
          id: id,
        },
        data: body,
      });
    });
    return subjectUpdated;
  }
}
