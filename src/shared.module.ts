import { Global, Module } from "@nestjs/common";
import { JwtAuthGuard } from "./app/auth/guards/jwt-auth.guard";
import { PermissionGuard } from "./app/auth/guards";
import { Reflector } from "@nestjs/core";

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
    ],
})
export class SharedModule { }