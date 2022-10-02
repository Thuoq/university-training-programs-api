import { Module } from '@nestjs/common';
import { KnowledgeBlocksController } from './knowledge_blocks.controller';
import { KnowledgeBlocksService } from './knowledge_blocks.service';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
  imports: [PrismaModule],
  controllers: [KnowledgeBlocksController],
  providers: [KnowledgeBlocksService],
  exports: [KnowledgeBlocksService],
})
export class KnowledgeBlocksModule {}
