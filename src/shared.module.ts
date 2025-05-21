import { Global, Module } from "@nestjs/common";
import { JwtAuthGuard } from "./app/auth/guards/jwt-auth.guard";
import { PermissionGuard } from "./app/auth/guards";
import { Reflector } from "@nestjs/core";
import { GetUser, RequirePermissions } from "./shared/decorators";

@Global()
@Module({
    providers: [
        JwtAuthGuard,
        PermissionGuard,
        Reflector,
    ],
    exports: [
        JwtAuthGuard,
        PermissionGuard,
        RequirePermissions,
        GetUser,
    ],
})
export class SharedModule { }