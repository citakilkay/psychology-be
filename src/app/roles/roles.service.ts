import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { handleSearchConditions } from 'src/shared/utils/handlers';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { CreateRoleDto, FilterRoleDto, RoleDetailDto, RoleDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../users/dto';
import { Permission, Role } from 'src/database/entities';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Role)
        private permissionRepository: Repository<Permission>,
    ) { }
    async getAll(filterDto: FilterRoleDto, /*#TODO user: User*/): Promise<[RoleDto[], number]> {
        const { search, page = 1, pageSize = 10, orderBy, orderDirection, roleGroup } = filterDto
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
        const role = await this.roleRepository.findOne({ where: { id } })
        if (role) {
            return plainToInstance(RoleDetailDto, role, { excludeExtraneousValues: true });

        }
        throw new HttpException(`Role with ID ${id} is not found`, HttpStatus.NOT_FOUND);
    }

    async create(createRoleDto: CreateRoleDto): Promise<RoleDetailDto> {
        const { permissionIds, ...roleData } = createRoleDto;
        const permissions = this.permissionRepository.findBy({ id: In(permissionIds) })
        if (permissionIds.length == permissions) {

        }
        if (!role) {
            throw new HttpException(`Role with id ${roleId} not found`, HttpStatus.NOT_FOUND);
        }
        const createdUser: User = await this.userRepository.save({ ...userData, role, password: hashedPassword })
        return plainToInstance(UserDetailDto, createdUser, { excludeExtraneousValues: true });
    }
    async update() {

    }

    async delete() {

    }

    async getUsersofRole(id: string): Promise<[UserDto[], number]> {
        return
    }
}
