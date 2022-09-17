import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { StudentModule } from './student/student.module';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { MajorModule } from './major/major.module';
import ConfigOption from './config/index';

@Module({
  imports: [
    ConfigModule.forRoot(ConfigOption),
    PrismaModule,
    StudentModule,
    AuthModule,
    EmployeeModule,
    MajorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
