import { SetMetadata } from "@nestjs/common";
import { AppPermission } from "../enums";

export const Permissions = (...permissions: AppPermission[]) => SetMetadata('permissions', permissions)