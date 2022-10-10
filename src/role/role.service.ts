import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dtos/createRole.dto';
import { ResourceService } from '../resource/resource.service';
import { Role } from '@prisma/client';
@Injectable()
export class RoleService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly resourceService: ResourceService,
  ) {}
  async createRole(@Body() body: CreateRoleDto): Promise<Role> {
    const findingResources = body.resourcesRoles.map((resource) =>
      this.resourceService.getResource(resource.resourceId),
    );
    const { resourcesRoles, ...roleCreate } = body;
    await Promise.all(findingResources);
    return this.prismaService.$transaction(async (transaction) => {
      const role = await transaction.role.create({
        data: roleCreate,
      });
      const resourcesRolesCreate = resourcesRoles.map((resourcesRole) => {
        return {
          ...resourcesRole,
          roleId: role.id,
        };
      });
      await transaction.resouceRole.createMany({
        data: resourcesRolesCreate,
      });
      return role;
    });
  }
  getListRole() {
    return this.prismaService.role.findMany({
      include: {
        resouceRoles: true,
      },
    });
  }
}
