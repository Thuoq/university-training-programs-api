import { Body, Controller, Get, Post } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { createResourceDto } from './dtos/createResource.dto';

@Controller('resources')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}
  @Get()
  async getListResource() {
    return await this.resourceService.getListResource();
  }
  @Post()
  async createResource(@Body() payload: createResourceDto) {
    return await this.resourceService.createResource(payload);
  }
}
