import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { handleSearchConditions } from 'src/shared/utils/handlers';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Role, User } from 'src/database/entities';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from './dto/payload.dto';
import { UserDetailDto, UserDto } from './dto/response.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) { }
    async getAll(filterDto: FilterUserDto, /*#TODO user: User*/): Promise<[UserDto[], number]> {
        const { search, page = 1, pageSize = 10, orderBy, orderDirection, ...otherFilters } = filterDto
        const skip = (page - 1) * pageSize;
        // Generate dynamic search conditions
        const searchConditions = handleSearchConditions<User>(search, ['username', 'firstName', 'lastName', 'emailAddress']);

        const customWhereOptions: FindOptionsWhere<User>[] = [...searchConditions];

        if (typeof otherFilters.isActive === 'boolean') {
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
                    role: { name: ILike(`%${search}%`) }
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

        const usersToResponse = await plainToInstance(UserDto, users, { excludeExtraneousValues: true });

        return [usersToResponse, total];
    }
    async get(id: string): Promise<UserDetailDto> {
        const user = await this.userRepository.findOne({ where: { id }, relations: ['role'] })
        if (user) {
            return await plainToInstance(UserDetailDto, user, { excludeExtraneousValues: true });
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
        const createdUser = await this.userRepository.save({ ...userData, role, password: hashedPassword })
        return await plainToInstance(UserDetailDto, createdUser, { excludeExtraneousValues: true });
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDetailDto> {
        const userToUpdate = await this.userRepository.findOne({ where: { id } })
        // Merge updateUserDto into userToUpdate
        const userData = await plainToInstance(User, { ...userToUpdate, ...updateUserDto });

        const updatedUser = await this.userRepository.save(userData);
        return await plainToInstance(UserDetailDto, updatedUser, { excludeExtraneousValues: true });
    }

    async delete(id: string): Promise<void> {
        const deleteToUser = await this.userRepository.findOne({ where: { id } })
        if (!deleteToUser) {
            throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
        }
        await this.userRepository.softRemove(deleteToUser)
        return
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

}
