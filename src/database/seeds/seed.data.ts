import { Role } from 'src/database/entities';
import { getConfig } from 'src/shared/config';
import { RoleGroup } from 'src/shared/enums';

const config = getConfig();

type SeedParentPermission = {
  name: string;
  description: string;
  isDefault: boolean;
  isEditable: boolean;
};

type SeedPermission = {
  name: string;
  description: string;
  isDefault: boolean;
  isEditable: boolean;
  parentName: string;
};

type SeedRole = {
  name: string;
  group: RoleGroup;
};

type SeedUser = {
  username: string;
  firstName?: string;
  lastName?: string;
  emailAddress: string;
  password: string;
  isActive: boolean;
  role?: Role;
};

export const parentPermissions: SeedParentPermission[] = [
  {
    name: 'User',
    description: 'All User Operations',
    isDefault: false,
    isEditable: false,
  },
  {
    name: 'Role',
    description: 'All Role Operations',
    isDefault: false,
    isEditable: false,
  },
  {
    name: 'Permission',
    description: 'All Permission Operations',
    isDefault: false,
    isEditable: false,
  },
  {
    name: 'Tenant',
    description: 'All Tenant Operations',
    isDefault: false,
    isEditable: false,
  },
];

export const permissions: SeedPermission[] = [
  {
    name: 'Read',
    description: 'GET /user Endpoints',
    isDefault: false,
    isEditable: false,
    parentName: 'User',
  },
  {
    name: 'Write',
    description: 'POST, PUT, DELETE etc. /user Endpoints',
    isDefault: false,
    isEditable: false,
    parentName: 'User',
  },
  {
    name: 'Read',
    description: 'GET /role Endpoints',
    isDefault: false,
    isEditable: false,
    parentName: 'Role',
  },
  {
    name: 'Write',
    description: 'POST, PUT, DELETE etc. /role Endpoints',
    isDefault: false,
    isEditable: false,
    parentName: 'Role',
  },
  {
    name: 'Read',
    description: 'GET /permission Endpoints',
    isDefault: false,
    isEditable: false,
    parentName: 'Permission',
  },
  {
    name: 'Write',
    description: 'POST, PUT, DELETE etc. /permission Endpoints',
    isDefault: false,
    isEditable: false,
    parentName: 'Permission',
  },
  {
    name: 'Read',
    description: 'GET /tenant Endpoints',
    isDefault: false,
    isEditable: false,
    parentName: 'Tenant',
  },
  {
    name: 'Write',
    description: 'POST, PUT, DELETE etc. /tenant Endpoints',
    isDefault: false,
    isEditable: false,
    parentName: 'Tenant',
  },
];
export const roles: SeedRole[] = [
  {
    name: 'SuperAdmin',
    group: RoleGroup.SuperAdmin,
  },
  {
    name: 'Admin',
    group: RoleGroup.Admin,
  },
  {
    name: 'Operator',
    group: RoleGroup.Operator,
  },
  {
    name: 'Client',
    group: RoleGroup.Client,
  },
];

export const users: SeedUser[] = [
  {
    username: config.seed.superadmin.USERNAME,
    firstName: 'Super',
    lastName: 'Admin',
    emailAddress: config.seed.superadmin.EMAIL_ADDRESS,
    password: config.seed.superadmin.PASSWORD,
    isActive: true,
  },
];
