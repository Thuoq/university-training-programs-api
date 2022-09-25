import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ACTION_CRUD, MODEL } from '../constant/models';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    this.$use(async (params: Prisma.MiddlewareParams, next) => {
      const { model, action, args } = params;
      if (
        (model === MODEL.STUDENT || model === MODEL.EMPLOYEE) &&
        (action === ACTION_CRUD.CREATE || action === ACTION_CRUD.UPDATE)
      ) {
        const payload = args.data;
        if (payload.password) {
          payload.password = await bcrypt.hash(
            payload.password,
            parseInt(process.env.SALT),
          );
        }
      }
      return await next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
