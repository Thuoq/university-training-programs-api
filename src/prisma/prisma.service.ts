import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ACTION_CRUD, IS_ACTIVE, MODEL } from '../constant/models';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    this.$use(this.softDelete4Finding);
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

  softDelete4Finding<T extends Prisma.BatchPayload = Prisma.BatchPayload>(
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<T>,
  ) {
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      params.action = 'findFirst';
      if (params.args?.where?.status == undefined) {
        params.args.where['isActive'] = IS_ACTIVE;
      }
    }
    if (params.action === 'findMany') {
      if (params.args?.where) {
        if (params.args?.where?.isActive == undefined) {
          params.args.where['isActive'] = IS_ACTIVE;
        }
      } else {
        params.args.where = {
          isActive: IS_ACTIVE,
        };
      }
    }

    return next(params);
  }
}
