import { Module } from '@nestjs/common';
import { AcademicYearModule } from 'src/academic-year/academic-year.module';
import { MajorModule } from 'src/major/major.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TrainingProgramController } from './training-program.controller';
import { TrainingProgramService } from './training-program.service';

@Module({
  imports: [PrismaModule, MajorModule, AcademicYearModule],
  controllers: [TrainingProgramController],
  providers: [TrainingProgramService],
  exports: [TrainingProgramService]
})
export class TrainingProgramModule {}
