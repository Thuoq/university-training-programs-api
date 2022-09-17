import { Module } from '@nestjs/common';
import { MajorService } from './major.service';
import { MajorController } from './major.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MajorService],
  controllers: [MajorController],
  exports: [MajorService],
})
export class MajorModule {}
