import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission, Role, RolePermission, User } from '../entities';
import { parentPermissions, permissions, roles, users } from './seed.data';
import { hashAKey } from 'src/shared/utils/handlers';
import { RoleGroup } from 'src/shared/enums/role-group.enum';

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
        @InjectRepository(RolePermission)
        private readonly rolePermissionRepository: Repository<RolePermission>,
        private readonly logger: Logger = new Logger()
    ) { }

    async seed() {

        this.logger.log("Starting Create Permissions...");
        await this.createPermissions();
        this.logger.log("Completed Creating Permissions");

        this.logger.log("Starting Create Roles...");
        await this.createRoles();
        this.logger.log("Completed Creating Permissions");

        this.logger.log("Starting Create Users...");
        await this.createUsers();
        this.logger.log("Completed Creating Permissions");

    }

    private async createPermissions() {
        for (const permission of parentPermissions) {
            const permissionExist = await this.permissionRepository.findOne({ where: { name: permission.name } });
            if (!permissionExist) {
                const newPermission = await this.permissionRepository.save(permissionExist)
            }
        }
        for (const permission of permissions) {
            const permissionExist = await this.permissionRepository.findOne({ where: { name: permission.name } });
            const parent = await this.permissionRepository.findOne({ where: { parent: { name: permission.parentName } }, select: { parent: { id: true } } })

            if (!permissionExist && parent) {
                const newPermission = await this.permissionRepository.create(permission)
                newPermission.parent = parent
                const createdPermission = await this.permissionRepository.save(newPermission)
            }
        }
    }

    private async createRoles() {
        for (const role of roles) {
            const roleExists = await this.roleRepository.findOne({ where: { name: role.name } });
            if (!roleExists) {
                const createdRole = await this.roleRepository.save(role);
                // Step 2: Fetch all permissions
                const permissions = await this.permissionRepository.find();
                // Step 3: Map permissions to RolePermission
                const rolePermissions = permissions.map(permission => {
                    const rolePermission = new RolePermission();
                    rolePermission.isActive = [RoleGroup.Admin, RoleGroup.SuperAdmin].includes(role.group) || permission.isDefault;
                    rolePermission.role = createdRole;
                    rolePermission.permission = permission;
                    return rolePermission;
                });
                // Step 4: Save rolePermissions
                await this.rolePermissionRepository.save(rolePermissions);
            }
        }
    }

    private async createUsers() {
        for (const user of users) {
            const userExists = await this.userRepository.findOne({ where: { username: user.username } });
            const superAdminRole = await this.roleRepository.findOne({ where: { group: RoleGroup.SuperAdmin } })
            if (!userExists && superAdminRole) {
                const hashedPassword = await hashAKey(user.password)
                user.password = hashedPassword
                const newUser = await this.userRepository.create(user)
                newUser.role = superAdminRole
                await this.userRepository.save(newUser)
            }
        }
    }
}
