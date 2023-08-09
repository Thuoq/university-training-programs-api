import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dtos/createEmployee.dto';
import { DepartmentService } from '../department/department.service';
import { FacultyService } from '../faculty/faculty.service';
import { PositionService } from '../position/position.service';
import { PostgresErrorCode } from '../prisma/postgresErrorCodes.enum';
import { SearchEmployeeQueryDto } from './dtos/searchEmployee.dto';
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
    try {
      const facultyPromise = payload.facultyId
        ? this.facultyService.getFaculty(payload.facultyId)
        : [];
      const departmentPromise = payload.departmentId
        ? this.departmentService.getDepartment(payload.departmentId)
        : [];
      const positionPromise = payload.positionId
        ? this.positionService.getPosition(payload.positionId)
        : [];
      await Promise.all([facultyPromise, departmentPromise, positionPromise]);
      const { positionId, ...bodyCreateEmployee } = payload;
      const employee = await this.prismaService.employee.create({
        data: bodyCreateEmployee,
      });
      await this.createEmployeePosition(employee.id, positionId);
      return employee;
    } catch (error) {
      console.log(error);
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          `Duplicate field ${error.meta.target[0]}`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  getListEmployee(query: SearchEmployeeQueryDto) {
    const { textSearch } = query;

    const searchCriteria = textSearch
      ? {
          OR: [
            {
              name: { contains: textSearch },
            },
            {
              email: { contains: textSearch },
            },
            {
              employeeCode: { contains: textSearch },
            },
            {
              faculty: {
                name: { contains: textSearch },
              },
            },
            {
              department: {
                name: { contains: textSearch },
              },
            },
            {
              section: {
                name: { contains: textSearch },
              },
            },
            {
              role: {
                name: { contains: textSearch },
              },
            },
          ],
        }
      : {};

    return this.prismaService.employee.findMany({
      where: searchCriteria,
      include: {
        role: true,
        positionEmployees: {
          include: {
            position: true,
          },
        },
        faculty: true,
        department: true,
        section: true,
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

  async getPositionEmployee(positionId: number, employeeId: number) {
    const positionEmployee = await this.prismaService.positionEmployee.findFirst({
      where: {
        employeeId: employeeId,
      },
    });
    if (!positionEmployee) {
      throw new HttpException('Dữ liệu không hợp lệ', HttpStatus.BAD_REQUEST);
    }
    return positionEmployee;
  }

  async updatePositionEmployee(employeeId: number, positionId: number) {
    await this.positionService.getPosition(positionId);
    return this.prismaService.positionEmployee.update({
      where: {
        id: employeeId,
      },
      data: {
        positionId: positionId,
      },
    });
  }
  async updateEmployee(code: string, payload: CreateEmployeeDto) {
    const employee = await this.getEmployeeByUnique(code);
    const employeePosition = await this.getPositionEmployee(
      payload.positionId,
      employee.id,
    );
    const employeeUpdated = this.prismaService.$transaction(async (transaction) => {
      if (payload.positionId) {
        await this.updatePositionEmployee(employeePosition.id, payload.positionId);
      }
      const { positionId, password, ...payloadUpdateEmployee } = payload;
      return this.prismaService.employee.update({
        where: {
          id: employee.id,
        },
        data: payloadUpdateEmployee,
      });
    });
    return employeeUpdated;
  }
}
