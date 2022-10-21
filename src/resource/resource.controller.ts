import { Body, Controller, Get, Post, Put, ParseIntPipe, Param, Delete } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { createResourceDto } from './dtos/createResource.dto';

@Controller('resources')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) { }
  @Get()
  async getListResource() {
    return await this.resourceService.getListResource();
  }
  @Post()
  async createResource(@Body() payload: createResourceDto) {
    return await this.resourceService.createResource(payload);
  }
  @Put(':id')
  async updateResource(@Param('id', ParseIntPipe) id: number, @Body() body: createResourceDto) {
    return await this.resourceService.updateResource(id, body);
  }
  @Get(':id')
  async getResource(@Param('id', ParseIntPipe) id: number) {
    return await this.resourceService.getResource(id);
  }
  @Delete(':id')
  async deleteResource(@Param('id', ParseIntPipe) id: number){
    return await this.resourceService.deleteResource(id);
  }
}
