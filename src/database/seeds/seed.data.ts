import { Role, RolePermission } from "src/database/entities";
import { getConfig } from "src/shared/config";
import { RoleGroup } from "src/shared/enums/role-group.enum";

const config = getConfig()

type SeedParentPermission = {
    name: string;
    description: string;
    isDefault: boolean;
    isEditable: boolean;
}

type SeedPermission = {
    name: string;
    description: string;
    isDefault: boolean;
    isEditable: boolean;
    parentName: string;
}

type SeedRole = {
    name: string;
    group: RoleGroup;
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

export const parentPermissions: SeedParentPermission[] = [{
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
    name: "Tenant",
    description: "All Tenant Operations",
    isDefault: false,
    isEditable: false
},

]

export const permissions: SeedPermission[] = [{
    name: "Access User",
    description: "GET /user Endpoints",
    isDefault: false,
    isEditable: false,
    parentName: "User"
}, {
    name: "Manage User",
    description: "POST, PUT, DELETE etc. /user Endpoints",
    isDefault: false,
    isEditable: false,
    parentName: "User"
}, {
    name: "Access Role",
    description: "GET /role Endpoints",
    isDefault: false,
    isEditable: false,
    parentName: "Role"
}, {
    name: "Manage Role",
    description: "POST, PUT, DELETE etc. /role Endpoints",
    isDefault: false,
    isEditable: false,
    parentName: "Role"
}, {
    name: "Access Permission",
    description: "GET /permission Endpoints",
    isDefault: false,
    isEditable: false,
    parentName: "Permission"
}, {
    name: "Manage Permission",
    description: "POST, PUT, DELETE etc. /permission Endpoints",
    isDefault: false,
    isEditable: false,
    parentName: "Permission"
}, {
    name: "Access Tenant",
    description: "GET /tenant Endpoints",
    isDefault: false,
    isEditable: false,
    parentName: "Tenant"
}, {
    name: "Manage Tenant",
    description: "POST, PUT, DELETE etc. /tenant Endpoints",
    isDefault: false,
    isEditable: false,
    parentName: "Tenant"
}]
export const roles: SeedRole[] = [{
    name: "SuperAdmin",
    group: RoleGroup.SuperAdmin
}, {
    name: "Admin",
    group: RoleGroup.Admin
}, {
    name: "Operator",
    group: RoleGroup.Operator
}, {
    name: "Client",
    group: RoleGroup.Client
}]

export const users: SeedUser[] = [{
    username: config.seed.superadmin.PASSWORD,
    firstName: "Super",
    lastName: "Admin",
    emailAddress: config.seed.superadmin.PASSWORD,
    password: config.seed.superadmin.PASSWORD,
    isActive: true,
}]