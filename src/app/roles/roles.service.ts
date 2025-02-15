import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { extractConflictColumn, extractReferencedTable, handleSearchConditions } from 'src/shared/utils/handlers';
import { FindOptionsWhere, In, QueryFailedError, Repository } from 'typeorm';
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
        const skip = (page - 1) * pageSize;


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
        const role = await this.roleRepository.findOne({ where: { id }, relations: { rolePermissions: { permission: true }, users: { role: true } } })
        if (role) {
            return plainToInstance(RoleDetailDto, role, { excludeExtraneousValues: true });
        }
        throw new HttpException(`Role with ID ${id} is not found`, HttpStatus.NOT_FOUND);
    }

    async create(createRoleDto: CreateRoleDto): Promise<RoleDetailDto> {
        // Step 1: Save the role
        try {
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
        } catch (err) {
            if (err.code === '23505' && err instanceof QueryFailedError) {
                const conflictColumn = extractConflictColumn(err.driverError.detail)
                // duplicate username or emailaddress
                throw new HttpException(`A role with the given ${conflictColumn} already exists`, HttpStatus.CONFLICT);
            }

            if (err.status) {
                throw new HttpException(err.message, err.status);
            }
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }



    async update(id: string, updateRoleDto: UpdateRoleDto): Promise<RoleDetailDto> {
        const { rolePermissionIds, ...otherFields } = updateRoleDto
        const roleToUpdate = await this.roleRepository.findOne({ where: { id } })
        if (roleToUpdate) {
            try {
                const rolePermissions = await this.rolePermissionRepository.findBy({ role: { id }, permission: { isDefault: false } })
                rolePermissions.map(rolePermission => {
                    rolePermissionIds.includes(rolePermission.id) ?

                        rolePermission.isActive = true :
                        rolePermission.isActive = false
                })
                await this.rolePermissionRepository.save(rolePermissions)
                const roleData = plainToInstance(Role, { ...roleToUpdate, ...otherFields });
                const updatedRole = await this.roleRepository.save(roleData);
                return plainToInstance(RoleDetailDto, updatedRole, { excludeExtraneousValues: true });
            } catch (err) {
                if (err.code === '23505' && err instanceof QueryFailedError) {
                    const conflictColumn = extractConflictColumn(err.driverError.detail)
                    // duplicate username or emailaddress
                    throw new HttpException(`A role with the given ${conflictColumn} already exists`, HttpStatus.CONFLICT);
                }
                if (err.status) {
                    throw new HttpException(err.message, err.status);
                }
                throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }
        throw new HttpException(`Role with id ${id} not found`, HttpStatus.NOT_FOUND);
    }

    async delete(id: string): Promise<void> {
        const deleteToRole = await this.roleRepository.findOne({ where: { id } })
        if (!deleteToRole) {
            throw new HttpException(`Role with id ${id} not found`, HttpStatus.NOT_FOUND);
        }
        try {
            await this.roleRepository.remove(deleteToRole)
            return
        } catch (err) {
            if (err.code === '23503' && err instanceof QueryFailedError) {
                const conflictColumn = extractReferencedTable(err.driverError.detail)
                throw new HttpException(`Role with id ${id} is associated with a user`, HttpStatus.CONFLICT);
            } if (err.status) {
                throw new HttpException(err.message, err.status);
            }
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
