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
import { AcademicYearModule } from './academic-year/academic-year.module';
import { KnowledgeBlockModule } from './knowledge-block/knowledge-block.module';
import { RoleModule } from './role/role.module';
import { ResourceModule } from './resource/resource.module';
import { TrainingProgramModule } from './training-program/training-program.module';
import { TrainingProgramContentModule } from './training-program-content/training-program-content.module';
import { SectionModule } from './section/section.module';
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
    AcademicYearModule,
    KnowledgeBlockModule,
    RoleModule,
    ResourceModule,
    TrainingProgramModule,
    TrainingProgramContentModule,
    SectionModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
