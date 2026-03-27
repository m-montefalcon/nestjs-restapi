// auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/definitions/users/user-role.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
