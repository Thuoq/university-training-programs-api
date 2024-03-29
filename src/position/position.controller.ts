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
import { CreatePositionDto } from './dtos/createPosition.dto';
import { PositionService } from './position.service';
import { Position } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { SearchPositionQueryDto } from './dtos/searchPosition.dto';

@ApiTags('Positions')
@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}
  @Post()
  async createPosition(@Body() body: CreatePositionDto): Promise<Position> {
    return await this.positionService.createPosition(body);
  }
  @Get()
  async getListPosition(@Query() query: SearchPositionQueryDto): Promise<Position[]> {
    return await this.positionService.getListPosition(query);
  }
  @Get(':id')
  async getPosition(@Param('id', ParseIntPipe) id: number): Promise<Position> {
    return await this.positionService.getPosition(id);
  }
  @Delete(':id')
  async deletePosition(@Param('id', ParseIntPipe) id: number): Promise<Position> {
    return await this.positionService.deletePosition(id);
  }

  @Put(':id')
  async updatePosition(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreatePositionDto,
  ) {
    return await this.positionService.updatePosition(id, body);
  }
}
