import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScoreDto } from './dtos/createScore.dto';
import { StudentService } from '../student/student.service';
import { SubjectService } from '../subject/subject.service';

@Injectable()
export class ScoreService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly studentService: StudentService,
    private readonly subjectService: SubjectService,
  ) {}

  async createScore(payload: CreateScoreDto) {
    const studentProcessing = this.studentService.getStudentByUnique(payload.studentId);
    const subjectProcessing = this.subjectService.getSubjectById(payload.subjectId);
    await Promise.all([studentProcessing, subjectProcessing]);
    return this.prismaService.score.create({
      data: payload,
    });
  }
  async getListScore() {
    return this.prismaService.score.findMany({
      include: {
        subject: true,
      },
    });
  }
  async getScore(id: number) {
    const score = this.prismaService.score.findUnique({
      where: {
        id,
      },
    });
    if (!score) {
      throw new NotFoundException('Điểm này không tồn tại ');
    }
    return score;
  }
  async deleteScore(id: number) {
    await this.getScore(id);
    return this.prismaService.score.delete({
      where: {
        id,
      },
    });
  }
}
