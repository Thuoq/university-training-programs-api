import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createResourceDto } from './dtos/createResource.dto';

@Injectable()
export class ResourceService {
  constructor(private readonly prismaService: PrismaService) {}

  async getResource(id: number) {
    const resource = await this.prismaService.resource.findUnique({
      where: {
        id,
      },
    });
    if (!resource) {
      throw new NotFoundException('Resource khong tim thay');
    }
    return resource;
  }
  getListResource() {
    return this.prismaService.resource.findMany();
  }
  createResource(payload: createResourceDto) {
    const exist = this.prismaService.resource.findUnique({
      where: {
        code: payload.code,
      },
    });
    if (exist) {
      throw new BadRequestException('Ton tai resources');
    }
    return this.prismaService.resource.create({
      data: payload,
    });
  }
}
