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
import { ApiTags } from '@nestjs/swagger';
import { CreateSectionDto } from './dtos/createSection.dto';
import { SectionService } from './section.service';

@ApiTags('Sections')
@Controller('sections')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  async createSection(@Body() payload: CreateSectionDto) {
    return await this.sectionService.createSection(payload);
  }

  @Get()
  async getListSection() {
    return await this.sectionService.getListSection();
  }

  @Get(':id')
  async getSection(@Param('id', ParseIntPipe) id: number) {
    return await this.sectionService.getSection(id);
  }

  @Delete(':id')
  async deleteSection(@Param('id', ParseIntPipe) id: number) {
    return await this.sectionService.deleteSection(id);
  }

  @Put(':id')
  async updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateSectionDto,
  ) {
    return await this.sectionService.updateSection(id, body);
  }
}
