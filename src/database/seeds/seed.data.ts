import { Role, RolePermission } from "src/database/entities";
import { getConfig } from "src/shared/config";
import { RoleGroup } from "src/shared/enums/role-group.enum";

const config = getConfig()

type SeedPermission = {
    name: string;
    description: string;
    isDefault: boolean;
    isEditable: boolean;
    parentId?: string;
}

type SeedRole = {
    name: string;
    group: string;
    rolePermissions?: RolePermission[];
}

type SeedUser = {
    username: string;
    firstName?: string;
    lastName?: string;
    emailAddress: string;
    password: string;
    isActive: boolean;
    role?: Role;
}

export const permissions: SeedPermission[] = [{
    name: "User",
    description: "All User Operations",
    isDefault: false,
    isEditable: false
}, {
    name: "Role",
    description: "All Role Operations",
    isDefault: false,
    isEditable: false
}, {
    name: "Permission",
    description: "All Permission Operations",
    isDefault: false,
    isEditable: false
}, {
    name: "Create User",
    description: "Create a new User",
    isDefault: false,
    isEditable: false
}, {
    name: "Update User",
    description: "Create a User",
    isDefault: false,
    isEditable: false
}, {
    name: "Delete User",
    description: "Delete a User",
    isDefault: false,
    isEditable: false
}, {
    name: "Get User",
    description: "Get User/Users",
    isDefault: false,
    isEditable: false
}, {
    name: "Create Role",
    description: "Create a new Role",
    isDefault: false,
    isEditable: false
}, {
    name: "Update Role",
    description: "Update a Role",
    isDefault: false,
    isEditable: false
}, {
    name: "Delete Role",
    description: "Delete a Role",
    isDefault: false,
    isEditable: false
}, {
    name: "Get Role",
    description: "Get Role/Roles",
    isDefault: false,
    isEditable: false
}, {
    name: "Create Permission",
    description: "Create a new Permission",
    isDefault: false,
    isEditable: false
}, {
    name: "Update Permission",
    description: "Update a Permission",
    isDefault: false,
    isEditable: false
}, {
    name: "Delete Permission",
    description: "Delete a Permission",
    isDefault: false,
    isEditable: false
}, {
    name: "Get Permission",
    description: "Get Permission/Permissions",
    isDefault: false,
    isEditable: false
}]
export const roles: SeedRole[] = [{
    name: "SuperAdmin",
    group: RoleGroup.SuperAdmin
}]

export const users: SeedUser[] = [{
    username: config.seed.superadmin.PASSWORD,
    firstName: "Super",
    lastName: "Admin",
    emailAddress: config.seed.superadmin.PASSWORD,
    password: config.seed.superadmin.PASSWORD,
    isActive: true,
}]