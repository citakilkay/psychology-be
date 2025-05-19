import { SetMetadata } from "@nestjs/common";
import { AppPermission } from "../enums";

export const RequirePermissions = (...permissions: AppPermission[]) => SetMetadata('permissions', permissions)