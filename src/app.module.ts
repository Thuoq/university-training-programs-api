import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { EmployeeModule } from './employee/employee.module';
import ConfigOption from './config/index';

@Module({
  imports: [ConfigModule.forRoot(ConfigOption), DatabaseModule, EmployeeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
