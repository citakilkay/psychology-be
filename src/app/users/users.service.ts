import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FilterUserDto } from './dto/filter-user.dto';
import { handleSearchConditions } from 'src/shared/utils/handlers/search.handler';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }
    async getAll(filterDto: FilterUserDto, user: User): Promise<[User[], number]> {
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
        return
    }
}
