import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ResourceController } from './resource.controller';

@Module({
  imports: [PrismaModule],
  providers: [ResourceService],
  exports: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
