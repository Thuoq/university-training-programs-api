import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { MajorModule } from './major/major.module';
import { FacultyModule } from './faculty/faculty.module';
import { SubjectModule } from './subject/subject.module';
import { ScoreModule } from './score/score.module';
import { DepartmentModule } from './department/department.module';
import { PositionModule } from './position/position.module';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import ConfigOption from './config/index';

@Module({
  imports: [
    ConfigModule.forRoot(ConfigOption),
    PrismaModule,
    StudentModule,
    AuthModule,
    EmployeeModule,
    MajorModule,
    FacultyModule,
    SubjectModule,
    ScoreModule,
    DepartmentModule,
    PositionModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
