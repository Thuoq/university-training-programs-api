import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createKnowledgeBlockDto } from './dtos/createKnowledgeBlock.dto';

@Injectable()
export class KnowledgeBlockService {
  constructor(private readonly prismaService: PrismaService) { }
  createKnowledgeBlock(payload: createKnowledgeBlockDto) {
    return this.prismaService.knowedgeBlock.create({
      data: payload,
    });
  }
  getListKnowledgeBlock() {
    return this.prismaService.knowedgeBlock.findMany();
  }
  async getKnowledgeBlock(id: number) {
    const knowledgeBlock = await this.prismaService.knowedgeBlock.findUnique({
      where: {
        id,
      },
    });
    if (!knowledgeBlock) {
      throw new NotFoundException('Không tìm thấy  Khoi kien thuc ');
    }
    return knowledgeBlock;
  }
  async deleteKnowledgeBlock(id: number) {
    await this.getKnowledgeBlock(id);
    return this.prismaService.knowedgeBlock.delete({
      where: {
        id,
      },
    });
  }
  async updateKnowledgeBlock(id: number, payload: createKnowledgeBlockDto) {
    await this.getKnowledgeBlock(id);
    return this.prismaService.knowedgeBlock.update({
      where: {
        id: id,
      },
      data: payload
    });
  }
}
