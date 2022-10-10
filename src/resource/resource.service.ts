import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
