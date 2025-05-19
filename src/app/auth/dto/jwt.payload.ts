import { RoleGroup } from "src/shared/enums";

export interface JwtPayload {
    id: string,
    tenantId: string,
    isActive: boolean,
    roleGroup: RoleGroup,
    permissions: string[]
}

export interface RequestWithUser extends Request {
    cookies: any;
    user: JwtPayload;
}