import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePositionDto } from './dtos/createPosition.dto';
import { PostgresErrorCode } from '../prisma/postgresErrorCodes.enum';
import { SearchPositionQueryDto } from './dtos/searchPosition.dto';
import { Prisma, PositionEmployee, Position } from '@prisma/client';
import { IS_ACTIVE } from '../constant/models';
import { omit, uniq } from 'lodash';
@Injectable()
export class PositionService {
  constructor(private readonly prismaService: PrismaService) {}
  async createPosition(payload: CreatePositionDto) {
    try {
      const pos = await this.prismaService.position.create({
        data: payload,
      });
      return pos;
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
  async getListPosition(query: SearchPositionQueryDto) {
    const { textSearch } = query;

    const searchCriteria: Prisma.PositionWhereInput = textSearch
      ? {
          OR: [
            {
              name: { contains: textSearch, mode: 'insensitive' },
            },
            {
              code: { contains: textSearch, mode: 'insensitive' },
            },
          ],
        }
      : {};
    const listPosition = await this.prismaService.position.findMany({
      where: searchCriteria,
      include: {
        positionEmployees: {
          where: {
            isActive: IS_ACTIVE,
          },
        },
      },
    });

    return listPosition.map((position) => ({
      ...omit(position, ['positionEmployees']),
      canDelete: this.canDeletePosition(position),
    }));
  }
  canDeletePosition(position: Position & { positionEmployees: PositionEmployee[] }) {
    const positionEmpActive = position.positionEmployees.filter(
      (poE) => poE.isActive === IS_ACTIVE,
    );
    return positionEmpActive.length === 0;
  }
  async getPosition(id: number) {
    const position = await this.prismaService.position.findUnique({
      where: {
        id,
      },
      include: {
        positionEmployees: {
          where: {
            isActive: IS_ACTIVE,
          },
        },
      },
    });
    if (!position) {
      throw new NotFoundException('Không tìm thấy chức vụ');
    }
    return position;
  }
  async deletePosition(id: number) {
    const pos = await this.getPosition(id);
    const canDelete = this.canDeletePosition(pos);

    if (!canDelete) throw new BadRequestException();
    const today = new Date();
    return this.prismaService.position.update({
      where: {
        id,
      },
      data: {
        code: `${pos.id}-${pos.code}-${today.getTime()}`,
        isActive: false,
      },
    });
  }

  async updatePosition(id: number, payload: CreatePositionDto) {
    await this.getPosition(id);
    return this.prismaService.position.update({
      where: {
        id: id,
      },
      data: payload,
    });
  }
  async getListPositionByIds(positionIds: number[]) {
    if (!positionIds.length) throw new BadRequestException();
    const positions = await this.prismaService.position.findMany({
      where: {
        id: {
          in: uniq(positionIds),
        },
      },
    });

    return positions;
  }
}
