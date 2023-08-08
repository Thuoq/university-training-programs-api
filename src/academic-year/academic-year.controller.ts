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
import { AcademicYear } from '@prisma/client';
import { createAcademicYearDto } from './dtos/createAcademicYear.dto';
import { AcademicYearService } from './academic-year.service';
import { ApiTags } from '@nestjs/swagger';
import { SearchAcademicYearQueryDto } from './dtos/search-academic-year.query.dto';

@ApiTags('Academic Year')
@Controller('academic-year')
export class AcademicYearController {
  constructor(private readonly academicYearService: AcademicYearService) {}
  @Post()
  async createAcademicYear(@Body() body: createAcademicYearDto): Promise<AcademicYear> {
    return await this.academicYearService.createAcademicYear(body);
  }
  @Get()
  async getListAcademicYear(
    @Query() query: SearchAcademicYearQueryDto,
  ): Promise<AcademicYear[]> {
    return await this.academicYearService.getListAcademicYear(query);
  }
  @Get(':id')
  async getAcademicYear(@Param('id', ParseIntPipe) id: number): Promise<AcademicYear> {
    return await this.academicYearService.getAcademicYear(id);
  }
  @Get(':textSearch')
  async searchAcademicYear(
    @Param('textSearch') textSearch: string,
  ): Promise<AcademicYear[]> {
    return await this.academicYearService.searchAcademicYear(textSearch);
  }
  @Delete(':id')
  async deleteAcademicYear(@Param('id', ParseIntPipe) id: number): Promise<AcademicYear> {
    return await this.academicYearService.deleteAcademicYear(id);
  }

  @Put(':id')
  async updateAcademicYear(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: createAcademicYearDto,
  ) {
    return await this.academicYearService.updateAcademicYear(id, body);
  }
}
