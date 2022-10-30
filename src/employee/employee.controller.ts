import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
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
  async getEmployee(@Param('id') id: number | string) {
    return await this.employeeService.getEmployeeByUnique(id);
  }
  @Put(':id')
  async updateEmployee(@Param('id') id: string, @Body() body: CreateEmployeeDto) {
    return await this.employeeService.updateEmployee(id, body);
  }
}
