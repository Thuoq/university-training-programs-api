import { Module } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FacultyController } from './faculty.controller';

@Module({
  imports: [PrismaModule],
  controllers: [FacultyController],
  providers: [FacultyService],
  exports: [FacultyService],
})
export class FacultyModule {}
