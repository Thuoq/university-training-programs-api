import { Module } from '@nestjs/common';
import { KnowledgeBlockController } from './knowledge-block.controller';
import { KnowledgeBlockService } from './knowledge-block.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KnowledgeBlockController],
  providers: [KnowledgeBlockService],
  exports: [KnowledgeBlockService]
})
export class KnowledgeBlockModule { }
