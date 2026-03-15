import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  customizeException,
  handleSearchConditions,
} from 'src/shared/utils/handlers';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from './dto/payload.dto';
import { RoleDetailDto, RoleDto } from './dto/response.dto';
import { plainToInstance } from 'class-transformer';
import { Permission, Role, RolePermission } from 'src/database/entities';
import { RoleGroup } from 'src/shared/enums';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
  ) {}
  async getAll(
    filterDto: FilterRoleDto /*#TODO user: User*/,
  ): Promise<[RoleDto[], number]> {
    const {
      search,
      page = 1,
      pageSize = 10,
      orderBy,
      orderDirection,
      roleGroup,
    } = filterDto;
    const skip = (page - 1) * pageSize;

    const baseWhere: FindOptionsWhere<Role> = {};
    if (roleGroup) {
      baseWhere.group = roleGroup;
    }
    const searchConditions = handleSearchConditions<Role>(search, ['name']);
    const where: FindOptionsWhere<Role>[] | FindOptionsWhere<Role> =
      searchConditions.length > 0
        ? [baseWhere, ...searchConditions]
        : baseWhere;

    const [roles, total] = await this.roleRepository.findAndCount({
      where,
      skip,
      take: pageSize,
      order: { [orderBy]: orderDirection },
    });

    const rolesToResponse = plainToInstance(RoleDto, roles, {
      excludeExtraneousValues: true,
    });
    return [rolesToResponse, total];
  }

  async get(id: string): Promise<RoleDetailDto> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: {
        rolePermissions: { permission: true },
        users: { role: true },
      },
    });
    if (role) {
      return plainToInstance(RoleDetailDto, role, {
        excludeExtraneousValues: true,
      });
    }
    throw new HttpException(
      `Role with ID ${id} is not found`,
      HttpStatus.NOT_FOUND,
    );
  }

  async create(createRoleDto: CreateRoleDto): Promise<RoleDetailDto> {
    // Step 1: Save the role
    try {
      const createdRole = await this.roleRepository.save(createRoleDto);
      // Step 2: Fetch all permissions
      const permissions = await this.permissionRepository.find();
      // Step 3: Map permissions to RolePermission
      const rolePermissions = permissions.map((permission) => {
        const rolePermission = new RolePermission();
        rolePermission.isActive =
          permission.isDefault || createdRole.group == RoleGroup.SuperAdmin;
        rolePermission.role = createdRole;
        rolePermission.permission = permission;
        return rolePermission;
      });
      // Step 4: Save rolePermissions
      await this.rolePermissionRepository.save(rolePermissions);

      // Step 5: Return the response mapped to RoleDetailDto
      return plainToInstance(RoleDetailDto, createdRole, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      return customizeException(err, { entity: 'Role' });
    }
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDetailDto> {
    const { rolePermissionIds, ...otherFields } = updateRoleDto;
    const roleToUpdate = await this.roleRepository.findOne({ where: { id } });
    if (roleToUpdate) {
      try {
        const rolePermissions = await this.rolePermissionRepository.findBy({
          role: { id },
          permission: { isDefault: false },
        });
        rolePermissions.forEach((rolePermission) => {
          rolePermission.isActive = rolePermissionIds.includes(
            rolePermission.id,
          );
        });
        await this.rolePermissionRepository.save(rolePermissions);
        const roleData = plainToInstance(Role, {
          ...roleToUpdate,
          ...otherFields,
        });
        const updatedRole = await this.roleRepository.save(roleData);
        return plainToInstance(RoleDetailDto, updatedRole, {
          excludeExtraneousValues: true,
        });
      } catch (err) {
        return customizeException(err, { entity: 'Role', id });
      }
    }
    throw new HttpException(
      `Role with id ${id} not found`,
      HttpStatus.NOT_FOUND,
    );
  }

  async delete(id: string): Promise<void> {
    const deleteToRole = await this.roleRepository.findOne({ where: { id } });
    if (!deleteToRole) {
      throw new HttpException(
        `Role with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      await this.roleRepository.remove(deleteToRole);
    } catch (err) {
      return customizeException(err, { entity: 'Role', id });
    }
  }
}
