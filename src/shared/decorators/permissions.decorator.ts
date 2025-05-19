import { SetMetadata } from "@nestjs/common";
import { AppPermission } from "../enums";

export const Roles = (...permissions: AppPermission[]) => SetMetadata('permissions', permissions)