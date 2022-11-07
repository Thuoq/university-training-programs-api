import { SetMetadata } from '@nestjs/common';

export const RolesAllowed = (...roles: Array<string | number>) =>
  SetMetadata('roles', roles);
