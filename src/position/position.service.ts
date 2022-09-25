import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePositionDto } from './dtos/createPosition.dto';

@Injectable()
export class PositionService {
  constructor(private readonly prismaService: PrismaService) {}
  createPosition(payload: CreatePositionDto) {
    return this.prismaService.position.create({
      data: payload,
    });
  }
  getListPosition() {
    return this.prismaService.position.findMany();
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
    await this.getPosition(id);
    return this.prismaService.position.delete({
      where: {
        id,
      },
    });
  }
}
