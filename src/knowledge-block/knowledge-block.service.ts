import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createKnowledgeBlockDto } from './dtos/createKnowledgeBlock.dto';
import { PostgresErrorCode } from '../prisma/postgresErrorCodes.enum';
import { SearchKnowledgeBlockQueryDto } from './dtos/searchKnowledgeBlock.dto';

@Injectable()
export class KnowledgeBlockService {
  constructor(private readonly prismaService: PrismaService) {}
  async createKnowledgeBlock(payload: createKnowledgeBlockDto) {
    try {
      const knowledgeBlock = await this.prismaService.knowledgeBlock.create({
        data: payload,
      });
      return knowledgeBlock;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          `Duplicate field ${error.meta.target[0]}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  getListKnowledgeBlock(query: SearchKnowledgeBlockQueryDto) {
    const { textSearch } = query;

    const searchCriteria = textSearch
      ? {
          OR: [
            {
              name: { contains: textSearch },
              knowledgeParentId: null,
            },
            {
              code: { contains: textSearch },
              knowledgeParentId: null,
            },
          ],
        }
      : { knowledgeParentId: null };

    return this.prismaService.knowledgeBlock.findMany({
      where: searchCriteria,
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
