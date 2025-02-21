import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
        if (!requiredPermissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        if (!user || !user.role || !user.role.rolePermissions) {
            return false;
        }

        const hasPermission = requiredPermissions.every(permission =>
            user.role.rolePermissions.some(
                rolePermission => 
                    rolePermission.permission.name === permission && 
                    rolePermission.isActive
            )
        );

        return hasPermission;
    }
} 