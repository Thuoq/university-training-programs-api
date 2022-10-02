import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createKnowledgeBlocksDto } from './dtos/createKnowledge_blocks.dto';


@Injectable()
export class KnowledgeBlocksService {
    constructor(private readonly prismaService: PrismaService) {}
        createKnowledgeBlock(payload: createKnowledgeBlocksDto){
            return this.prismaService.knowledgeBlock.create({
                data: payload,
            });
        }

    getListKnowledgeBlock(){
        return this.prismaService.knowledgeBlock.findMany();
    }

    async getKnowledgeBlock(id: number){
        const knowledge_blocks = await this.prismaService.knowledgeBlock.findUnique({
            where: {
                id,
            },
        });

        if(!knowledge_blocks) {
            throw new NotFoundException('Do not find knowledge block');
        }
        return knowledge_blocks;
    }

    async deleteKnowledgeBlock(id: number) {
        await this.getKnowledgeBlock(id);
        return this.prismaService.knowledgeBlock.delete({
          where: {
            id,
          },
        });
      }
}
