import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateRoleDto } from './dtos/createRole.dto';
import { RoleService } from './role.service';
import { SearchRoleQueryDto } from './dtos/searchRole.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  async createRole(@Body() body: CreateRoleDto) {
    return await this.roleService.createRole(body);
  }
  @Get()
  async getListRole(@Query() query: SearchRoleQueryDto) {
    return await this.roleService.getListRole(query);
  }
}
