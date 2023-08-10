import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createKnowledgeBlockDto } from './dtos/createKnowledgeBlock.dto';
import { PostgresErrorCode } from '../prisma/postgresErrorCodes.enum';
import { SearchKnowledgeBlockQueryDto } from './dtos/searchKnowledgeBlock.dto';
import { KnowledgeBlock, TrainingProgramContent } from '@prisma/client';
import { IS_ACTIVE } from '../constant/models';
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
  async getListKnowledgeBlock(query: SearchKnowledgeBlockQueryDto) {
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

    const knowledgeBlocks = await this.prismaService.knowledgeBlock.findMany({
      where: searchCriteria,
      include: {
        knowledgeChildren: {
          where: {
            isActive: IS_ACTIVE,
          },
          include: {
            trainingProgramContents: {
              where: {
                isActive: IS_ACTIVE,
              },
            },
          },
        },
        trainingProgramContents: {
          where: {
            isActive: IS_ACTIVE,
          },
        },
      },
    });
    return knowledgeBlocks.map((know) => ({
      ...know,
      canDelete:
        know.knowledgeChildren.length === 0 && this.canDeleteKnowledgeChildren(know),
      knowledgeChildren: know.knowledgeChildren.map((know) => ({
        ...know,
        canDelete: this.canDeleteKnowledgeChildren(know),
      })),
    }));
  }

  canDeleteKnowledgeChildren(
    know: KnowledgeBlock & { trainingProgramContents: TrainingProgramContent[] },
  ) {
    const trainingActive = know.trainingProgramContents.filter(
      (train) => train.isActive === IS_ACTIVE,
    );
    return trainingActive.length === 0;
  }

  async getKnowledgeBlock(id: number) {
    const knowledgeBlock = await this.prismaService.knowledgeBlock.findUnique({
      where: {
        id,
      },
      include: {
        knowledgeChildren: {
          where: {
            isActive: IS_ACTIVE,
          },
        },
        trainingProgramContents: {
          where: {
            isActive: IS_ACTIVE,
          },
        },
      },
    });
    if (!knowledgeBlock) {
      throw new NotFoundException('Không tìm thấy  Khoi kien thuc ');
    }
    return knowledgeBlock;
  }
  async deleteKnowledgeBlock(id: number) {
    const know = await this.getKnowledgeBlock(id);
    const isParent = know.knowledgeParentId === null;
    if (isParent && know.knowledgeChildren.length !== 0) {
      throw new BadRequestException();
    }
    const canDelete = this.canDeleteKnowledgeChildren(know);
    if (!canDelete) throw new BadRequestException();
    const today = new Date();

    return this.prismaService.knowledgeBlock.update({
      where: {
        id,
      },
      data: {
        isActive: false,
        code: `${know.id}-${know.code}-${today.getTime()}`,
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
