import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { KnowledgeBlock } from '@prisma/client';
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
  ): Promise<KnowledgeBlock> {
    return await this.knowledgeBlockService.createKnowledgeBlock(body);
  }
  @Get()
  async getListKnowledgeBlock(): Promise<KnowledgeBlock[]> {
    return await this.knowledgeBlockService.getListKnowledgeBlock();
  }
  @Get(':id')
  async getKnowledgeBlock(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<KnowledgeBlock> {
    return await this.knowledgeBlockService.getKnowledgeBlock(id);
  }
  @Delete(':id')
  async deleteKnowledgeBlock(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<KnowledgeBlock> {
    return await this.knowledgeBlockService.deleteKnowledgeBlock(id);
  }
  @Put(':id')
  async updateKnowledgeBlock(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: createKnowledgeBlockDto,
  ) {
    return await this.knowledgeBlockService.updateKnowledgeBlock(id, body);
  }
}
