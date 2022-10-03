import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { MajorService } from './major.service';
import { CreateMajorDto } from './dtos/createMajor.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Major')
@Controller('majors')
export class MajorController {
  constructor(private readonly majorService: MajorService) {}
  @Get()
  async getListMajor() {
    return await this.majorService.getListMajor();
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
}
