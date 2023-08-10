import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateEmployeeDto } from './dtos/createEmployee.dto';
import { EmployeeService } from './employee.service';
import { ApiTags } from '@nestjs/swagger';
import { SearchEmployeeQueryDto } from './dtos/searchEmployee.dto';

@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
  @Get()
  async getListEmployee(@Query() query: SearchEmployeeQueryDto) {
    return await this.employeeService.getListEmployee(query);
  }
  @Post()
  async createEmployee(@Body() body: CreateEmployeeDto) {
    return await this.employeeService.createEmployee(body);
  }
  @Get(':id')
  async getEmployee(@Param('id') id: number | string) {
    return await this.employeeService.getEmployeeByUnique(id);
  }
  @Put(':code')
  async updateEmployee(@Param('code') code: string, @Body() body: CreateEmployeeDto) {
    return await this.employeeService.updateEmployee(code, body);
  }
}
