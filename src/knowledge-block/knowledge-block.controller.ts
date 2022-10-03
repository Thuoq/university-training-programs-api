import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { KnowedgeBlock } from '@prisma/client';
import { createKnowledgeBlockDto } from './dtos/createKnowledgeBlock.dto';
import { KnowledgeBlockService } from './knowledge-block.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Knowledge block')
@Controller('knowledge-block')
export class KnowledgeBlockController {
  constructor(private readonly knowledgeBlockService: KnowledgeBlockService) {}
  @Post()
  async createKnowledgeBlock(
    @Body() body: createKnowledgeBlockDto,
  ): Promise<KnowedgeBlock> {
    return await this.knowledgeBlockService.createKnowledgeBlock(body);
  }
  @Get()
  async getListKnowledgeBlock(): Promise<KnowedgeBlock[]> {
    return await this.knowledgeBlockService.getListKnowledgeBlock();
  }
  @Get(':id')
  async getKnowledgeBlock(@Param('id', ParseIntPipe) id: number): Promise<KnowedgeBlock> {
    return await this.knowledgeBlockService.getKnowledgeBlock(id);
  }
  @Delete(':id')
  async deleteKnowledgeBlock(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<KnowedgeBlock> {
    return await this.knowledgeBlockService.deleteKnowledgeBlock(id);
  }
}
