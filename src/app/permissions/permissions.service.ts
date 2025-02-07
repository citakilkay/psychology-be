import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Permission, Role } from 'src/database/entities';
import { In, IsNull, Repository } from 'typeorm';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/payload.dto';
import { PermissionDetailDto, PermissionDto } from './dto/response.dto';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
    ) { }
    async getAllParentPermissions(): Promise<[PermissionDto[], number]> {
        const [permissions, count] = await this.permissionRepository.findAndCount({
            where: { parent: IsNull() }
        })
        return [plainToInstance(PermissionDto, permissions), count];
    }

    async get(id: string): Promise<PermissionDetailDto> {
        const permission = await this.permissionRepository.findOne({ where: { id }, relations: { childPermissions: true, parent: true } })
        if (permission) {
            return plainToInstance(PermissionDetailDto, permission);
        }
        throw new HttpException(`Permission with ID ${id} is not found`, HttpStatus.NOT_FOUND)
    }

    async create(createPermissionDto: CreatePermissionDto): Promise<PermissionDetailDto> {
        const createdPermission = await this.permissionRepository.create({ ...createPermissionDto })
        if (createPermissionDto.parentId) {
            const parentPermission = await this.permissionRepository.findOne({ where: { id: createPermissionDto.parentId } })
            createdPermission.parent = parentPermission
        }
        await this.permissionRepository.save(createdPermission)
        return plainToInstance(PermissionDetailDto, createdPermission, { excludeExtraneousValues: true });
    }

    async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<PermissionDetailDto> {
        const permission = await this.permissionRepository.findOne({ where: { id } })
        if (permission) {
            if (!permission.isEditable) {
                throw new HttpException(`Permission with id ${id} is not editable`, HttpStatus.BAD_REQUEST)
            }
            const childPermissions = await this.permissionRepository.findBy({ id: In([updatePermissionDto.childPermissionIds]) })
            const permissionData = plainToInstance(Permission, { ...permission, ...updatePermissionDto })
            permission.childPermissions = childPermissions
            await this.permissionRepository.save(permissionData)
            return plainToInstance(PermissionDetailDto, permissionData, { excludeExtraneousValues: true });
        }
        throw new HttpException(`Permission with id ${id} not found`, HttpStatus.NOT_FOUND)
    }

    async delete(id: string): Promise<void> {
        const permission = await this.permissionRepository.findOne({ where: { id } })
        if (permission) {
            if (permission.isDefault) {
                throw new HttpException(`Permission with id ${id} is not deletable`, HttpStatus.BAD_REQUEST)
            }
            await this.permissionRepository.remove(permission)
        }
        throw new HttpException(`Permission with id ${id} not found`, HttpStatus.NOT_FOUND)
    }
}

