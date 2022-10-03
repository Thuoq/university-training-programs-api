import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Department } from '@prisma/client';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dtos/createDepartment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Departments')
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}
  @Post()
  async createDepartment(@Body() body: CreateDepartmentDto): Promise<Department> {
    return await this.departmentService.createDepartment(body);
  }
  @Get()
  async getListDepartment(): Promise<Department[]> {
    return await this.departmentService.getListDepartment();
  }
  @Get(':id')
  async getDepartment(@Param('id', ParseIntPipe) id: number): Promise<Department> {
    return await this.departmentService.getDepartment(id);
  }
  @Delete(':id')
  async deleteDepartment(@Param('id', ParseIntPipe) id: number): Promise<Department> {
    return await this.departmentService.deleteDepartment(id);
  }
}
