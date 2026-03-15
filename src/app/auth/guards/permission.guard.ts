import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ReqUser } from '../dto';
import { AppPermission } from 'src/shared/enums';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndMerge<AppPermission[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: ReqUser = request.user;

    const hasPermission = requiredPermissions.every((reqPermission) =>
      user.permissions.some(
        (userPermission) => userPermission === reqPermission,
      ),
    );
    return hasPermission;
  }
}
