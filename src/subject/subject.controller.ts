import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateSubjectDto } from './dtos/createSubject.dto';
import { SubjectService } from './subject.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) { }

  @Get()
  async getAllSubject() {
    return await this.subjectService.getAllSubject();
  }

  @Post()
  async createSubject(@Body() body: CreateSubjectDto) {
    return await this.subjectService.createSubjectService(body);
  }

  @Get(':id')
  async getOneSubject(@Param('id', ParseIntPipe) id: number) {
    return await this.subjectService.getSubjectById(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteSubject(@Param('id', ParseIntPipe) id: number) {
    return await this.subjectService.deleteSubject(id);
  }
  @Put(':id')
  async updateSubject(@Param('id', ParseIntPipe) id: number, @Body() body: CreateSubjectDto) {
    return await this.subjectService.updateSubject(id, body);
  }
}
