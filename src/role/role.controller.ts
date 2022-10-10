import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateRoleDto } from './dtos/createRole.dto';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  async createRole(@Body() body: CreateRoleDto) {
    return await this.roleService.createRole(body);
  }
  @Get()
  async getListRole() {
    return await this.roleService.getListRole();
  }
}
