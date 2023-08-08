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
  @Get()
  async getListTrainingProgramContent() {
    return await this.trainingProgramContentService.getListTrainingProgramContent();
  }

  @Get(':trainingProgram')
  async getTrainingProgramContent(
    @Param('trainingProgram', ParseIntPipe) trainingProgramId: number,
  ) {
    return await this.trainingProgramContentService.getTrainingProgramContent(
      trainingProgramId,
    );
  }

  @Delete(':trainingProgramId')
  async deleteTrainingProgramContent(
    @Param('trainingProgramId', ParseIntPipe) trainingProgramId: number,
  ) {
    return await this.trainingProgramContentService.deleteManyTrainingProgramContent(
      trainingProgramId,
    );
  }
}
