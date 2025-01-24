import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { handleSearchConditions } from 'src/shared/utils/handlers';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from './dto/payload.dto';
import { RoleDetailDto, RoleDto } from './dto/response.dto';
import { plainToInstance } from 'class-transformer';
import { Permission, Role, RolePermission } from 'src/database/entities';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
        @InjectRepository(RolePermission)
        private rolePermissionRepository: Repository<RolePermission>,
    ) { }
    async getAll(filterDto: FilterRoleDto, /*#TODO user: User*/): Promise<[RoleDto[], number]> {
        const { search, page = 1, pageSize = 10, orderBy, orderDirection, roleGroup } = filterDto
        console.log("first")
        debugger;
        console.log("last")
        const skip = (page - 1) * pageSize;

        // Generate dynamic search conditions
        const searchConditions = handleSearchConditions<Role>(search, ['name']);
        const customWhereOptions: FindOptionsWhere<Role>[] = [...searchConditions];

        if (roleGroup) {
            customWhereOptions.push({ group: roleGroup });
        }

        const [roles, total] = await this.roleRepository.findAndCount({
            where: customWhereOptions.length > 0 ? customWhereOptions : {},
            skip,
            take: pageSize,
            order: { [orderBy]: orderDirection },
        });
        const rolesToResponse = plainToInstance(RoleDto, roles, { excludeExtraneousValues: true });
        return [rolesToResponse, total];
    }

    async get(id: string): Promise<RoleDetailDto> {
        const role = await this.roleRepository.findOne({ where: { id }, relations: { rolePermissions: { permission: true }, users: true } })
        if (role) {
            return plainToInstance(RoleDetailDto, role, { excludeExtraneousValues: true });
        }
        throw new HttpException(`Role with ID ${id} is not found`, HttpStatus.NOT_FOUND);
    }

    async create(createRoleDto: CreateRoleDto): Promise<RoleDetailDto> {
        // Step 1: Save the role
        const createdRole = await this.roleRepository.save(createRoleDto);

        // Step 2: Fetch all permissions
        const permissions = await this.permissionRepository.find();

        // Step 3: Map permissions to RolePermission
        const rolePermissions = permissions.map(permission => {
            const rolePermission = new RolePermission();
            rolePermission.isActive = permission.isDefault;
            rolePermission.role = createdRole;
            rolePermission.permission = permission;
            return rolePermission;
        });

        // Step 4: Save rolePermissions
        await this.rolePermissionRepository.save(rolePermissions);

        // Step 5: Return the response mapped to RoleDetailDto
        return plainToInstance(RoleDetailDto, createdRole, { excludeExtraneousValues: true });
    }

    async update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleDetailDto> {
        const { rolePermissionIds, ...otherFields } = updateRoleDto
        const roleToUpdate = await this.roleRepository.findOne({ where: { id } })
        if (roleToUpdate) {
            const rolePermissions = await this.rolePermissionRepository.findBy({ id: In([rolePermissionIds]) })
            if (rolePermissionIds.length == rolePermissions.length) {
                const roleData = plainToInstance(Role, { ...roleToUpdate, ...otherFields, rolePermissions });
                const updatedRole = await this.roleRepository.save(roleData);
                return plainToInstance(RoleDetailDto, updatedRole, { excludeExtraneousValues: true });
            }
            const missingPermissionIds = rolePermissionIds.filter(i => !rolePermissions.map(x => x.id).includes(i))
            throw new HttpException(`Permissions with ids ${missingPermissionIds.join(' | ')} not found`, HttpStatus.NOT_FOUND);
        }
        throw new HttpException(`Role with id ${id} not found`, HttpStatus.NOT_FOUND);
    }

    async delete(id: string): Promise<void> {
        const deleteToRole = await this.roleRepository.findOne({ where: { id } })
        if (!deleteToRole) {
            throw new HttpException(`Role with id ${id} not found`, HttpStatus.NOT_FOUND);
        }
        await this.roleRepository.softRemove(deleteToRole)
        return
    }
}
