import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, QueryFailedError, Repository } from 'typeorm';
import { customizeException, handleSearchConditions, hashAKey } from 'src/shared/utils/handlers';
import { plainToInstance } from 'class-transformer';
import { Role, Tenant, User, Usership } from 'src/database/entities';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from './dto/payload.dto';
import { UserDetailDto, UserDto } from './dto/response.dto';
import { RoleGroup } from "src/shared/enums";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        @InjectRepository(Tenant)
        private tenantRepository: Repository<Tenant>,
    ) { }
    async getAll(filterDto: FilterUserDto, tenantIdOfUser?: string): Promise<[UserDto[], number]> {
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
        if (tenantIdOfUser) {
            customWhereOptions.push(
                {
                    tenant: { id: tenantIdOfUser }
                }
            )
        }
        const [users, total] = await this.userRepository.findAndCount({
            where: customWhereOptions.length > 0 ? customWhereOptions : {},
            select: { role: { name: true }, usership: { lastLoginDate: true, updatedAt: true }, tenant: { id: true, fullBrandName: true } },
            skip,
            take: pageSize,
            order: { [orderBy]: orderDirection },
        });

        const usersToResponse = plainToInstance(UserDto, users, { excludeExtraneousValues: true, groups: ['userservice'] });

        return [usersToResponse, total];
    }
    async get(id: string, tenantId?: string): Promise<UserDetailDto> {
        const customWhereOptions: FindOptionsWhere<User>[] = [{ id }];
        if (tenantId) {
            customWhereOptions.push({ tenant: { id: tenantId } })
        }
        const user = await this.userRepository.findOne({ where: customWhereOptions, relations: ['role'] })
        if (user) {
            return plainToInstance(UserDetailDto, user, { excludeExtraneousValues: true });
        }
        throw new HttpException(`User with ID ${id} is not found`, HttpStatus.NOT_FOUND);
    }

    async create(createUserDto: CreateUserDto, tenantIdOfUser?: string): Promise<UserDetailDto> {

        const { password, roleId, tenantId, ...userData } = createUserDto;

        if (tenantIdOfUser && tenantIdOfUser !== tenantId) {
            throw new HttpException(`You are not allowed to assign users to the tenant with ID '${tenantId}'.`, HttpStatus.FORBIDDEN);
        }

        const hashedPassword = await hashAKey(password)
        const role = await this.roleRepository.findOne({ where: { id: roleId } })
        const tenant = await this.tenantRepository.findOne({ where: { id: tenantId } })
        if (!role) {
            throw new HttpException(`Role with id ${roleId} not found`, HttpStatus.NOT_FOUND);
        }
        if (!tenant && role.group == RoleGroup.SuperAdmin) {
            throw new HttpException('A user must related a tenant', HttpStatus.BAD_REQUEST);
        }
        try {
            const createdUser = await this.userRepository.save({ ...userData, role, tenant, password: hashedPassword }) // #TEST usership create ediliyor mu? eger oyleyse new Usershipleri kaldir diger yerlerden.
            return plainToInstance(UserDetailDto, createdUser, { excludeExtraneousValues: true });
        } catch (err) {
            return customizeException(err, { entity: "User" })
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto, tenantIdOfUser?: string): Promise<UserDetailDto> {
        const customWhereOptions: FindOptionsWhere<User>[] = [{ id }];
        if (tenantIdOfUser) {
            customWhereOptions.push({ tenant: { id: tenantIdOfUser } })
        }
        const userToUpdate = await this.userRepository.findOne({ where: customWhereOptions })
        // Merge updateUserDto into userToUpdate
        if (userToUpdate) {
            const userData = plainToInstance(User, { ...userToUpdate, ...updateUserDto });
            try {
                const updatedUser = await this.userRepository.save(userData);
                return plainToInstance(UserDetailDto, updatedUser, { excludeExtraneousValues: true });
            } catch (err) {
                return customizeException(err, { entity: "User", id })
            }
        }
        throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
    }

    async delete(id: string, tenantIdOfUser?: string): Promise<void> {
        const customWhereOptions: FindOptionsWhere<User>[] = [{ id }];
        if (tenantIdOfUser) {
            customWhereOptions.push({ tenant: { id: tenantIdOfUser } })
        }
        const deleteToUser = await this.userRepository.findOne({ where: customWhereOptions, select: { role: { group: true }, tenant: { isActive: true, id: true, name: true, admin: { id: true } } } })
        if (!deleteToUser) {
            throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
        }
        const isDefaultTenantAdmin = deleteToUser.tenant?.admin?.id === id
        if (isDefaultTenantAdmin) {
            throw new HttpException(
                `The user is the default admin of the active tenant "${deleteToUser.tenant?.name}" and cannot be deleted.`,
                HttpStatus.FORBIDDEN,
            );
        }
        await this.userRepository.softRemove(deleteToUser)
        return
    }
}
