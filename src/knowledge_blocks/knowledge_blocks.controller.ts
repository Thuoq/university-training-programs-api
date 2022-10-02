import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { createKnowledgeBlocksDto } from './dtos/createKnowledge_blocks.dto';
import { KnowledgeBlocksService } from './knowledge_blocks.service';
import { KnowledgeBlock } from '@prisma/client';


@Controller('knowledge-blocks')
export class KnowledgeBlocksController {
    constructor(private readonly knowledgeBlockService: KnowledgeBlocksService) {}
  @Post()
  async createKnowledgeBlock(@Body() body: createKnowledgeBlocksDto): Promise<KnowledgeBlock> {
    return await this.knowledgeBlockService.createKnowledgeBlock(body);
  }
  @Get()
  async getListKnowledgeBlock(): Promise<KnowledgeBlock[]> {
    return await this.knowledgeBlockService.getListKnowledgeBlock();
  }
  @Get(':id')
  async getKnowledgeBlock(@Param('id', ParseIntPipe) id: number): Promise<KnowledgeBlock> {
    return await this.knowledgeBlockService.getKnowledgeBlock(id);
  }
  @Delete(':id')
  async deleteKnowledgeBlock(@Param('id', ParseIntPipe) id: number): Promise<KnowledgeBlock> {
    return await this.knowledgeBlockService.deleteKnowledgeBlock(id);
  }
}
