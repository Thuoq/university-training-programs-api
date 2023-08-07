import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dtos/createDepartment.dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly prismaService: PrismaService) {}
  createDepartment(payload: CreateDepartmentDto) {
    return this.prismaService.department.create({
      data: payload,
    });
  }
  getListDepartment() {
    return this.prismaService.department.findMany({});
  }
  async getDepartment(id: number) {
    const department = await this.prismaService.department.findUnique({
      where: {
        id,
      },
    });
    if (!department) {
      throw new NotFoundException('Không tìm thấy department');
    }
    return department;
  }
  async deleteDepartment(id: number) {
    await this.getDepartment(id);
    return this.prismaService.department.delete({
      where: {
        id,
      },
    });
  }
}
