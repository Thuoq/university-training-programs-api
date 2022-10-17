import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SubjectModule } from 'src/subject/subject.module';
import { TrainingProgramModule } from 'src/training-program/training-program.module';
import { TrainingProgramContentController } from './training-program-content.controller';
import { TrainingProgramContentService } from './training-program-content.service';

@Module({
  imports: [PrismaModule, SubjectModule, TrainingProgramModule],
  controllers: [TrainingProgramContentController],
  providers: [TrainingProgramContentService],
  exports: [TrainingProgramContentService],
})
export class TrainingProgramContentModule {}
