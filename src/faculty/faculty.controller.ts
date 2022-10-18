import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { Faculty } from '@prisma/client';
import { createFacultyDto } from './dtos/createFaculty.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Faculties')
@Controller('faculties')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) { }
  @Post()
  async createFaculty(@Body() body: createFacultyDto): Promise<Faculty> {
    return await this.facultyService.createFaculty(body);
  }
  @Get()
  async getListFaculty(): Promise<Faculty[]> {
    return await this.facultyService.getListFaculty();
  }
  @Get(':id')
  async getFaculty(@Param('id', ParseIntPipe) id: number): Promise<Faculty> {
    return await this.facultyService.getFaculty(id);
  }
  @Delete(':id')
  async deleteFaculty(@Param('id', ParseIntPipe) id: number): Promise<Faculty> {
    return await this.facultyService.deleteFaculty(id);
  }
  @Put(':id')
  async updateFaculty(@Param('id', ParseIntPipe) id: number, @Body() body: createFacultyDto) {
    return await this.facultyService.updateFaculty(id, body);
  }
}
