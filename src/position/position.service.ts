import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePositionDto } from './dtos/createPosition.dto';
import { PostgresErrorCode } from '../prisma/postgresErrorCodes.enum';

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
  getListPosition() {
    return this.prismaService.position.findMany({});
  }
  async getPosition(id: number) {
    const position = await this.prismaService.position.findUnique({
      where: {
        id,
      },
    });
    if (!position) {
      throw new NotFoundException('Không tìm thấy chức vụ');
    }
    return position;
  }
  async deletePosition(id: number) {
    const pos = await this.getPosition(id);
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
}
