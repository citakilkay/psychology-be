import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload, ReqUser } from '../dto';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
        if (!requiredPermissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: ReqUser = request.user;

        const hasPermission = requiredPermissions.every(reqPermission =>
            user.permissions.some(userPermission => userPermission === reqPermission)
        );
        return hasPermission;
    }
}