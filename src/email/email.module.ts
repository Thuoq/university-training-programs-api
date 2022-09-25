import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { JwtModule } from '@nestjs/jwt';
import { EmailConfirmationService } from './emailConfirmation.service';

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  controllers: [],
  providers: [EmailService, EmailConfirmationService],
  exports: [EmailService, EmailConfirmationService],
})
export class EmailModule {}
