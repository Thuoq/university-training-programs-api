import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dtos/createEmployee.dto';
import { DepartmentService } from '../department/department.service';
import { FacultyService } from '../faculty/faculty.service';
import { PositionService } from '../position/position.service';
@Injectable()
export class EmployeeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly departmentService: DepartmentService,
    private readonly facultyService: FacultyService,
    private readonly positionService: PositionService,
  ) {}
  async getEmployeeByUnique(value: string | number) {
    const emp = await this.prismaService.employee.findFirst({
      where: {
        OR:
          typeof value === 'number'
            ? [{ id: value }]
            : [{ employeeCode: value }, { email: value }],
      },
      include: {
        faculty: {
          select: {
            name: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
        positionEmployees: {
          select: {
            position: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    if (!emp) {
      throw new NotFoundException('Do not found employee');
    }
    return emp;
  }
  async createEmployee(payload: CreateEmployeeDto) {
    const facultyPromise = this.facultyService.getFaculty(payload.facultyId);
    const departmentPromise = this.departmentService.getDepartment(payload.departmentId);
    const positionPromise = this.positionService.getPosition(payload.positionId);
    await Promise.all([facultyPromise, departmentPromise, positionPromise]);
    const { positionId, ...bodyCreateEmployee } = payload;
    const employee = await this.prismaService.employee.create({
      data: bodyCreateEmployee,
    });
    await this.createEmployeePosition(employee.id, positionId);
    return employee;
  }
  getListEmployee() {
    return this.prismaService.employee.findMany({
      include: {
        role: true,
        positionEmployees: {
          include: {
            position: true,
          },
        },
        faculty: true,
        department: true,
      },
    });
  }
  createEmployeePosition(employeeId: number, positionId: number) {
    return this.prismaService.positionEmployee.create({
      data: {
        employeeId,
        positionId,
      },
    });
  }

  async updatePassword(employeeId: number, newPassword) {
    return this.prismaService.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        password: newPassword,
      },
    });
  }
}
