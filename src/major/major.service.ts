import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMajorDto } from './dtos/createMajor.dto';
import { PostgresErrorCode } from '../prisma/postgresErrorCodes.enum';

@Injectable()
export class MajorService {
  constructor(private readonly prisma: PrismaService) {}
  getListMajor() {
    return this.prisma.major.findMany({
      include: {
        faculty: true,
        section: true,
      },
    });
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
  async createMajor(payload: CreateMajorDto) {
    try {
      const major = await this.prisma.major.create({ data: payload });
      return major;
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
  deleteMajor(id: number) {
    return this.prisma.major.delete({
      where: {
        id,
      },
    });
  }
  async updateMajor(id: number, payload: CreateMajorDto) {
    await this.getMajorUnique(id);
    return this.prisma.major.update({
      where: {
        id: id,
      },
      data: payload,
    });
  }
}
