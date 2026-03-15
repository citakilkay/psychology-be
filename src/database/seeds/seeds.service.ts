import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Permission, Role, RolePermission, User, Usership } from '../entities';
import { parentPermissions, permissions, roles, users } from './seed.data';
import { hashAKey } from 'src/shared/utils/handlers';
import { RoleGroup } from 'src/shared/enums';

@Injectable()
export class SeedService {
  private readonly logger: Logger = new Logger(SeedService.name);
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async seed() {
    this.logger.log('Starting Create Permissions...');
    await this.createPermissions();
    this.logger.log('Completed Creating Permissions');

    this.logger.log('Starting Create Roles...');
    await this.createRoles();
    this.logger.log('Completed Creating Permissions');

    this.logger.log('Starting Create Users...');
    await this.createUsers();
    this.logger.log('Completed Creating Permissions');
  }

  private async createPermissions() {
    try {
      for (const permission of parentPermissions) {
        const permissionExist = await this.permissionRepository.findOne({
          where: { name: permission.name, parent: IsNull() },
        });
        if (!permissionExist) {
          await this.permissionRepository.save(permission);
        }
      }
      for (const permission of permissions) {
        const permissionExist = await this.permissionRepository.findOne({
          where: {
            name: permission.name,
            parent: { name: permission.parentName },
          },
        });
        const parent = await this.permissionRepository.findOne({
          where: { name: permission.parentName },
        });

        if (!permissionExist && parent) {
          const newPermission =
            await this.permissionRepository.create(permission);
          newPermission.parent = parent;
          await this.permissionRepository.save(newPermission);
        }
      }
    } catch (error) {
      this.logger.error('Seeding failed: ', error);
      throw new InternalServerErrorException(
        'Create Permission seeding failed',
      );
    }
  }

  private async createRoles() {
    try {
      for (const role of roles) {
        const roleExists = await this.roleRepository.findOne({
          where: { name: role.name },
        });
        if (!roleExists) {
          const createdRole = await this.roleRepository.save(role);
          // Step 2: Fetch all permissions
          const permissions = await this.permissionRepository.find();
          // Step 3: Map permissions to RolePermission
          const rolePermissions = permissions.map((permission) => {
            const rolePermission = new RolePermission();
            rolePermission.isActive =
              createdRole.group == RoleGroup.SuperAdmin || permission.isDefault;
            rolePermission.role = createdRole;
            rolePermission.permission = permission;
            return rolePermission;
          });
          // Step 4: Save rolePermissions
          await this.rolePermissionRepository.save(rolePermissions);
        }
      }
    } catch (error) {
      this.logger.error('Seeding failed: ', error);
      throw new InternalServerErrorException('Create Roles seeding failed');
    }
  }

  private async createUsers() {
    try {
      for (const user of users) {
        const userExists = await this.userRepository.findOne({
          where: { username: user.username },
        });
        const superAdminRole = await this.roleRepository.findOne({
          where: { group: RoleGroup.SuperAdmin },
        });
        if (!userExists && superAdminRole) {
          const hashedPassword = await hashAKey(user.password);
          user.password = hashedPassword;
          const newUser = await this.userRepository.create(user);
          const usership = new Usership();
          newUser.usership = usership;
          newUser.role = superAdminRole;
          await this.userRepository.save(newUser);
        }
      }
    } catch (error) {
      this.logger.error('Seeding failed: ', error);
      throw new InternalServerErrorException('Create User seeding failed');
    }
  }
}
