import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreatePositionDto } from '../position/dtos/createPosition.dto';
import { Department } from '@prisma/client';
import { DepartmentService } from './department.service';
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}
  @Post()
  async createDepartment(@Body() body: CreatePositionDto): Promise<Department> {
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
