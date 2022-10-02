import { Module } from '@nestjs/common';
import { AcademicYearService } from './academic-year.service';
import { AcademicYearController } from './academic-year.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AcademicYearService],
  controllers: [AcademicYearController],
})
export class AcademicYearModule {}
