import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, QueryFailedError, Repository } from 'typeorm';
import { extractConflictColumn, handleSearchConditions, hashAKey } from 'src/shared/utils/handlers';
import { plainToInstance } from 'class-transformer';
import { Role, User, Usership } from 'src/database/entities';
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
            relations: ['role', 'usership'],
            select: { role: { name: true }, usership: { lastLoginDate: true, updatedAt: true } },
            skip,
            take: pageSize,
            order: { [orderBy]: orderDirection },
        });

        const usersToResponse = plainToInstance(UserDto, users, { excludeExtraneousValues: true, groups: ['userservice'] });

        return [usersToResponse, total];
    }
    async get(id: string): Promise<UserDetailDto> {
        const user = await this.userRepository.findOne({ where: { id }, relations: ['role'] })
        if (user) {
            return plainToInstance(UserDetailDto, user, { excludeExtraneousValues: true });
        }
        throw new HttpException(`User with ID ${id} is not found`, HttpStatus.NOT_FOUND);
    }

    async create(createUserDto: CreateUserDto): Promise<UserDetailDto> {

        const { password, roleId, ...userData } = createUserDto;
        const hashedPassword = await hashAKey(password)
        const role = await this.roleRepository.findOne({ where: { id: roleId } })
        if (!role) {
            throw new HttpException(`Role with id ${roleId} not found`, HttpStatus.NOT_FOUND);
        }
        try {
            const createdUser = await this.userRepository.save({ ...userData, role, password: hashedPassword }) // #TEST usership create ediliyor mu? eger oyleyse new Usershipleri kaldir diger yerlerden.
            return plainToInstance(UserDetailDto, createdUser, { excludeExtraneousValues: true });
        } catch (err) {
            if (err.code === '23505' && err instanceof QueryFailedError) {
                const conflictColumn = extractConflictColumn(err.driverError.detail)
                throw new HttpException(`A user with the given value ${conflictColumn} already exists`, HttpStatus.CONFLICT);
            }
            if (err.status) {
                throw new HttpException(err.message, err.status);
            }
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDetailDto> {
        const userToUpdate = await this.userRepository.findOne({ where: { id } })
        // Merge updateUserDto into userToUpdate
        const userData = plainToInstance(User, { ...userToUpdate, ...updateUserDto });
        try {
            const updatedUser = await this.userRepository.save(userData);
            return plainToInstance(UserDetailDto, updatedUser, { excludeExtraneousValues: true });
        } catch (err) {
            if (err.code === '23505' && err instanceof QueryFailedError) {
                const conflictColumn = extractConflictColumn(err.driverError.detail)
                throw new HttpException(`A user with the given ${conflictColumn} already exists`, HttpStatus.CONFLICT);
            }
            if (err.status) {
                throw new HttpException(err.message, err.status);
            }
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async delete(id: string): Promise<void> {
        const deleteToUser = await this.userRepository.findOne({ where: { id } })
        if (!deleteToUser) {
            throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
        }
        await this.userRepository.softRemove(deleteToUser)
        return
    }
}
