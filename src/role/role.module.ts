import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ResourceModule } from '../resource/resource.module';

@Module({
  imports: [PrismaModule, ResourceModule],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
