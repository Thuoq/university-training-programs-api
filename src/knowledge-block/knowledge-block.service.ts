import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createKnowledgeBlockDto } from './dtos/createKnowledgeBlock.dto';

@Injectable()
export class KnowledgeBlockService {
  constructor(private readonly prismaService: PrismaService) {}
  async createKnowledgeBlock(payload: createKnowledgeBlockDto) {
    return this.prismaService.knowledgeBlock.create({
      data: payload,
    });
  }
  getListKnowledgeBlock() {
    return this.prismaService.knowledgeBlock.findMany({
      where: {
        knowledgeParentId: null,
      },
      include: {
        knowledgeChildren: true,
      },
    });
  }
  async getKnowledgeBlock(id: number) {
    const knowledgeBlock = await this.prismaService.knowledgeBlock.findUnique({
      where: {
        id,
      },
      include: {
        knowledgeChildren: true,
      },
    });
    if (!knowledgeBlock) {
      throw new NotFoundException('Không tìm thấy  Khoi kien thuc ');
    }
    return knowledgeBlock;
  }
  async deleteKnowledgeBlock(id: number) {
    await this.getKnowledgeBlock(id);
    return this.prismaService.knowledgeBlock.delete({
      where: {
        id,
      },
    });
  }
  async updateKnowledgeBlock(id: number, payload: createKnowledgeBlockDto) {
    await this.getKnowledgeBlock(id);
    return this.prismaService.knowledgeBlock.update({
      where: {
        id: id,
      },
      data: payload,
    });
  }
}
