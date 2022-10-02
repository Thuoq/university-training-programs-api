import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateSubjectDto } from './dtos/createSubject.dto';
import { SubjectService } from './subject.service';

@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}
  @Post()
  async createSubject(@Body() payload: CreateSubjectDto) {
    return await this.subjectService.createSubject(payload);
  }
  @Get()
  async getListSubject() {
    return await this.subjectService.getListSubject();
  }
  @Get(':id')
  async getSubject(@Param('id', ParseIntPipe) id: number) {
    return await this.subjectService.getSubjectByUnique(id);
  }
  @Delete(':id')
  async deleteSubject(@Param('id', ParseIntPipe) id: number) {
    return await this.subjectService.deleteSubject(id);
  }
}
