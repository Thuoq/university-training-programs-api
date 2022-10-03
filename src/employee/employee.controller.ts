import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateEmployeeDto } from './dtos/createEmployee.dto';
import { EmployeeService } from './employee.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
  @Get()
  async getListEmployee() {
    return await this.employeeService.getListEmployee();
  }
  @Post()
  async createEmployee(@Body() body: CreateEmployeeDto) {
    return await this.employeeService.createEmployee(body);
  }
  @Get(':id')
  async getEmployee(@Param('id', ParseIntPipe) id: number) {
    return await this.employeeService.getEmployeeByUnique(id);
  }
}
