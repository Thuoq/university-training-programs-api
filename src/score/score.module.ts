import { Module } from '@nestjs/common';
import { ScoreController } from './score.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ScoreService } from './score.service';
import { StudentModule } from '../student/student.module';
import { SubjectModule } from '../subject/subject.module';

@Module({
  imports: [PrismaModule, StudentModule, SubjectModule],
  controllers: [ScoreController],
  providers: [ScoreService],
})
export class ScoreModule {}
