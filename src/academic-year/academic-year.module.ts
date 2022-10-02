import { Module } from '@nestjs/common';
import { AcademicYearService } from './academic-year.service';

@Module({
  providers: [AcademicYearService]
})
export class AcademicYearModule {}
