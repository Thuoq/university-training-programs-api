import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AcademicYear } from '@prisma/client';
import { createAcademicYearDto } from './dtos/createAcademicYear.dto';
import { AcademicYearService } from './academic-year.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Academic Year')
@Controller('academic-year')
export class AcademicYearController {
  constructor(private readonly academicYearService: AcademicYearService) {}
  @Post()
  async createAcademicYear(@Body() body: createAcademicYearDto): Promise<AcademicYear> {
    return await this.academicYearService.createAcademicYear(body);
  }
  @Get()
  async getListAcademicYear(): Promise<AcademicYear[]> {
    return await this.academicYearService.getListAcademicYear();
  }
  @Get(':id')
  async getAcademicYear(@Param('id', ParseIntPipe) id: number): Promise<AcademicYear> {
    return await this.academicYearService.getAcademicYear(id);
  }
  @Delete(':id')
  async deleteAcademicYear(@Param('id', ParseIntPipe) id: number): Promise<AcademicYear> {
    return await this.academicYearService.deleteAcademicYear(id);
  }
}
