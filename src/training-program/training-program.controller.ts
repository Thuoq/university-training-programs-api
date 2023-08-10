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
import { ApiTags } from '@nestjs/swagger';
import { CreateTrainingProgramDto } from './dtos/createTrainingProgram.dto';
import { TrainingProgramService } from './training-program.service';
import { SearchTrainingProgramQueryDto } from './dtos/searchTrainingProgram.dto';

@ApiTags('Training Programs')
@Controller('training-programs')
export class TrainingProgramController {
  constructor(private readonly trainingProgramService: TrainingProgramService) {}

  @Post()
  async createTrainingProgram(@Body() payload: CreateTrainingProgramDto) {
    return await this.trainingProgramService.createTrainingProgram(payload);
  }

  @Get()
  async getListTrainingProgram(@Query() query: SearchTrainingProgramQueryDto) {
    return await this.trainingProgramService.getListTrainingProgram(query);
  }

  @Get(':id')
  async getTrainingProgram(@Param('id', ParseIntPipe) id: number) {
    return await this.trainingProgramService.getTrainingProgramByUnique(id);
  }
  @Delete(':id')
  async deleteTrainingProgram(@Param('id', ParseIntPipe) id: number) {
    return await this.trainingProgramService.deleteTrainingProgram(id);
  }
  @Put(':id')
  async updateTrainingProgram(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateTrainingProgramDto,
  ) {
    return await this.trainingProgramService.updateTrainingProgram(id, body);
  }
}
