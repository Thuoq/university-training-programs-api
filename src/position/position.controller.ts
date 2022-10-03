import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreatePositionDto } from './dtos/createPosition.dto';
import { PositionService } from './position.service';
import { Position } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Positions')
@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}
  @Post()
  async createPosition(@Body() body: CreatePositionDto): Promise<Position> {
    return await this.positionService.createPosition(body);
  }
  @Get()
  async getListPosition(): Promise<Position[]> {
    return await this.positionService.getListPosition();
  }
  @Get(':id')
  async getPosition(@Param('id', ParseIntPipe) id: number): Promise<Position> {
    return await this.positionService.getPosition(id);
  }
  @Delete(':id')
  async deletePosition(@Param('id', ParseIntPipe) id: number): Promise<Position> {
    return await this.positionService.deletePosition(id);
  }
}
