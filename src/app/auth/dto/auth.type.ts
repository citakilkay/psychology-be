import { AppPermission, RoleGroup } from "src/shared/enums";
import { Request } from 'express';

export interface JwtPayload {
    id: string,
    username: string,
}

export interface ReqUser {
    id: string,
    username: string,
    isActive: boolean,
    tenantId: string,
    roleGroup: RoleGroup,
    permissions: AppPermission[],
    usershipId: string
}

export interface RequestWithUser extends Request {
    cookies: any;
    user: ReqUser;
}