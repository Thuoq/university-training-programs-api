import {
  Controller,
  Body,
  Post,
  Param,
  Get,
  ParseIntPipe,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTrainingProgramContentDto } from './dtos/createTrainingProgramContent.dto';
import { TrainingProgramContentService } from './training-program-content.service';

@ApiTags('Training Program Contents')
@Controller('training-program-contents')
export class TrainingProgramContentController {
  constructor(
    private readonly trainingProgramContentService: TrainingProgramContentService,
  ) {}

  @Post('/many')
  async createManyTrainingProgramContent(
    @Body() payload: CreateTrainingProgramContentDto[],
  ) {
    return await this.trainingProgramContentService.createManyTrainingProgramContent(
      payload,
    );
  }
  @Post()
  async createTrainingProgramContent(@Body() payload: CreateTrainingProgramContentDto) {
    return await this.trainingProgramContentService.createTrainingProgramContent(payload);
  }

  @Get()
  async getListTrainingProgramContent() {
    return await this.trainingProgramContentService.getListTrainingProgramContent();
  }

  @Get(':id')
  async getTrainingProgramContent(@Param('id', ParseIntPipe) id: number) {
    return await this.trainingProgramContentService.getTrainingProgramContent(id);
  }

  @Delete(':id')
  async deleteTrainingProgramContent(@Param('id', ParseIntPipe) id: number) {
    return await this.trainingProgramContentService.deleteTrainingProgramContent(id);
  }
  @Put(':id')
  async updateTrainingProgramContent(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateTrainingProgramContentDto,
  ) {
    return await this.trainingProgramContentService.updateTrainingProgramContent(
      id,
      body,
    );
  }
}
