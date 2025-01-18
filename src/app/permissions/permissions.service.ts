import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Permission, Role } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreatePermissionDto, PermissionDetailDto, PermissionDto } from './dto';

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
            where: { parent: null },
        })
        return [plainToInstance(PermissionDto, permissions, { excludeExtraneousValues: true }), count];
    }

    async get(id: string): Promise<PermissionDetailDto> {
        const permission = await this.permissionRepository.findOne({ where: { id }, relations: { childPermissions: true, parent: true } })
        if (permission) {
            return plainToInstance(PermissionDetailDto, permission, { excludeExtraneousValues: true });
        }
        throw new HttpException(`Permission with ID ${id} is not found`, HttpStatus.NOT_FOUND)
    }

    async create(createPermissionDto: CreatePermissionDto): Promise<PermissionDetailDto> {
        const createdPermission = await this.permissionRepository.create({ ...createPermissionDto })
        return plainToInstance(PermissionDetailDto, createdPermission, { excludeExtraneousValues: true });
    }

    async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<PermissionDetailDto> {

    }

    async delete() {

    }
}
