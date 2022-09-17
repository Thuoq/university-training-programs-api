import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateStudentDto } from './dtos/createStudent.dto';
import { StudentService } from './student.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  @Post()
  async createStudent(@Body() payload: CreateStudentDto) {
    return await this.studentService.createStudent(payload);
  }
  @Get()
  async getListStudent() {
    return await this.studentService.getListStudent();
  }
  @Get(':id')
  async getStudent(@Param('id', ParseIntPipe) id: number) {
    return await this.studentService.getStudentByUnique(id);
  }
  @Delete(':id')
  async deleteStudent(@Param('id', ParseIntPipe) id: number) {
    return await this.studentService.deleteStudent(id);
  }
}
