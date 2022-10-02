import { Module } from '@nestjs/common';
import { KnowledgeBlockController } from './knowledge-block.controller';
import { KnowledgeBlockService } from './knowledge-block.service';

@Module({
  controllers: [KnowledgeBlockController],
  providers: [KnowledgeBlockService],
})
export class KnowledgeBlockModule {}
