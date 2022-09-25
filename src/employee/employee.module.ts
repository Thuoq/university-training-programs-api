import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FacultyModule } from '../faculty/faculty.module';
import { DepartmentModule } from '../department/department.module';
import { PositionModule } from '../position/position.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PrismaModule, FacultyModule, DepartmentModule, PositionModule, EmailModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
