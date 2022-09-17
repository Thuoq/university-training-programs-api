import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMajorDto } from './dtos/createMajor.dto';

@Injectable()
export class MajorService {
  constructor(private readonly prisma: PrismaService) {}
  getListMajor() {
    return this.prisma.major.findMany();
  }
  async getMajorUnique(value: number) {
    const major = await this.prisma.major.findUnique({
      where: {
        id: value,
      },
    });
    if (!major) {
      throw new NotFoundException('Ngành này chưa được tạo');
    }
    return major;
  }
  createMajor(payload: CreateMajorDto) {
    return this.prisma.major.create({ data: payload });
  }
  deleteMajor(id: number) {
    return this.prisma.major.delete({
      where: {
        id,
      },
    });
  }
}
