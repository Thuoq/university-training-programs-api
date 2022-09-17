import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MajorModule } from '../major/major.module';

@Module({
  imports: [PrismaModule, MajorModule],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
