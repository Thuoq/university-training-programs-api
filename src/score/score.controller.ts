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
} from '@nestjs/common';
import { CreateScoreDto } from './dtos/createScore.dto';
import { ScoreService } from './score.service';

@Controller('scores')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}
  @Post()
  async createScore(@Body() payload: CreateScoreDto) {
    return await this.scoreService.createScore(payload);
  }

  @Get()
  async getListScore() {
    return await this.scoreService.getListScore();
  }

  @Get(':id')
  async getScore(@Param('id', ParseIntPipe) id: number) {
    return await this.scoreService.getScore(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteScore(@Param('id', ParseIntPipe) id: number) {
    return await this.scoreService.deleteScore(id);
  }
}
