import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { FindOptionsWhere, ILike, Like, Repository } from 'typeorm';
import { FilterUserDto } from './dto/payload/filter-user.dto';
import { handleSearchConditions } from 'src/shared/utils/handlers/search.handler';
import { UserDetailDto } from './dto/response/user-detail.dto';
import { CreateUserDto } from './dto/payload/create-user.dto';
import { UpdateUserDto } from './dto/payload/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/database/entities/role.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) { }
    async getAll(filterDto: FilterUserDto, /*#TODO user: User*/): Promise<[User[], number]> {
        const { search, page = 1, pageSize = 10, orderBy, orderDirection, ...otherFilters } = filterDto
        const skip = (page - 1) * pageSize;
        // Generate dynamic search conditions
        const searchConditions = handleSearchConditions<User>(search, ['username', 'firstName', 'lastName', 'emailAddress']);

        const customWhereOptions: FindOptionsWhere<User>[] = [...searchConditions];

        if (typeof otherFilters.isActive === 'boolean') { // #TEST isActive when undefined
            customWhereOptions.push({ isActive: otherFilters.isActive });
        }
        if (otherFilters.roleGroup) {
            customWhereOptions.push(
                {
                    role: {
                        group: otherFilters.roleGroup
                    }
                }
            )
        }
        if (search) {
            customWhereOptions.push(
                {
                    role: {
                        name: ILike(`%${search}%`)
                    }
                }
            )
        }
        const [users, total] = await this.userRepository.findAndCount({ // #TEST -- is password excluded? if so remove the unnecessary dtos (user-detai.dto),
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
        const createdUser: User = await this.userRepository.save({ ...userData, role, password: hashedPassword })
        return plainToInstance(UserDetailDto, createdUser, { excludeExtraneousValues: true });
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDetailDto> {
        const userToUpdate = await this.userRepository.findOne({ where: { id } })
        // Merge updateUserDto into userToUpdate
        const userData = plainToInstance(User, { ...userToUpdate, ...updateUserDto });

        const updatedUser = await this.userRepository.save(userData);
        return plainToInstance(UserDetailDto, updatedUser, { excludeExtraneousValues: true });
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
