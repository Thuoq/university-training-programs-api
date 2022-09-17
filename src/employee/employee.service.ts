import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getEmployeeByUnique(value: string | number) {
    const emp = await this.prismaService.employee.findFirst({
      where: {
        OR: [typeof value === 'number' ? { id: value } : { email: value }],
      },
    });
    if (!emp) {
      throw new NotFoundException('Do not found employee');
    }
    return emp;
  }
}
