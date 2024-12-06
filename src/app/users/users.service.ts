import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FilterUserDto } from './dto/payload/filter-user.dto';
import { handleSearchConditions } from 'src/shared/utils/handlers/search.handler';
import { UserDetailDto } from './dto/response/user-detail.dto';
import { CreateUserDto } from './dto/payload/create-user.dto';
import { UpdateUserDto } from './dto/payload/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/database/entities/role.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) { }
    async getAll(filterDto: FilterUserDto, /*user: User*/): Promise<[User[], number]> {
        const { isActive, search, page = 1, pageSize = 10, roleGroup, orderBy, orderDirection } = filterDto
        const skip = (page - 1) * pageSize;
        // Generate dynamic search conditions
        const searchConditions = handleSearchConditions<User>(search, ['username', 'firstName', 'lastName', 'emailAddress']);

        const customWhereOptions: FindOptionsWhere<User>[] = [...searchConditions];

        if (isActive !== undefined) {
            customWhereOptions.push({ isActive });
        }
        if (roleGroup) {
            customWhereOptions.push(
                {
                    role: {
                        group: roleGroup
                    }
                }
            )
        }
        const [users, total] = await this.userRepository.findAndCount({
            where: customWhereOptions.length > 0 ? customWhereOptions : {},
            relations: ['role'],
            skip,
            take: pageSize,
            order: { [orderBy]: orderDirection },
        });

        return [users, total];
    }
    async get(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } })
        if (user) {
            return user;
        }
        throw new HttpException(`User with ID ${id} is not found`, HttpStatus.NOT_FOUND);
    }

    async create(createUserDto: CreateUserDto): Promise<UserDetailDto> {
        const { password, roleId, ...userData } = createUserDto;

        const hashedPassword = await this.hashPassword(password)
        const role = await this.roleRepository.findOne({ where: { id: roleId } })
        if (!role) {
            throw new HttpException(`Role with id ${roleId} not found`, HttpStatus.NOT_FOUND);
        }
        return await this.userRepository.save({ ...userData, role, password: hashedPassword })
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDetailDto> {
        return
    }

    async delete(id: string): Promise<User> {
        const deleteToUser = await this.userRepository.findOne({ where: { id } })
        if (!deleteToUser) {
            throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
        }
        return await this.userRepository.softRemove(deleteToUser)
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

}
