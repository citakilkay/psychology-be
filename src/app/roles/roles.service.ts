import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/database/entities/role.entity';
import { handleSearchConditions } from 'src/shared/utils/handlers/search.handler'; // fazla olan yerler icin index.ts'ten cek
import { FindOptionsWhere, Repository } from 'typeorm';
import { FilterRoleDto } from './dto/payload/filter-role.dto';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) { }
    async getAll(filterDto: FilterRoleDto, /*#TODO user: User*/): Promise<[Role[], number]> {
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
        return [roles, total];
    }

    async get(id: string): Promise<Role> {
        const role = await this.roleRepository.findOne({ where: { id } })
        if (role) {
            return role;
        }
        throw new HttpException(`User with ID ${id} is not found`, HttpStatus.NOT_FOUND);
    }

    async create() {

    }
    async update() {

    }

    async delete() {

    }

    async getUsersofRole(id: string): Promise < [User[], number] > {
    return
    }
}
