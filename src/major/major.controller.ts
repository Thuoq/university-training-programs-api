import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MajorService } from './major.service';
import { CreateMajorDto } from './dtos/createMajor.dto';
import { ApiTags } from '@nestjs/swagger';
import { query } from 'express';
import { SearchMajorQueryDto } from './dtos/search-major.query.dto';

@ApiTags('Major')
@Controller('majors')
export class MajorController {
  constructor(private readonly majorService: MajorService) {}
  @Get()
  async getListMajor(@Query() query: SearchMajorQueryDto) {
    return await this.majorService.getListMajor(query);
  }
  @Post()
  async createMajor(@Body() payload: CreateMajorDto) {
    return await this.majorService.createMajor(payload);
  }
  @Get(':id')
  async getMajor(@Param('id', ParseIntPipe) id: number) {
    return await this.majorService.getMajorUnique(id);
  }
  @Delete(':id')
  async deleteMajor(@Param('id', ParseIntPipe) id: number) {
    return await this.majorService.deleteMajor(id);
  }
  @Put(':id')
  async updateMajor(@Param('id', ParseIntPipe) id: number, @Body() body: CreateMajorDto) {
    return await this.majorService.updateMajor(id, body);
  }
}
