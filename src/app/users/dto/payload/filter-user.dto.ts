import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/database/entities/user.entity';
import { RoleGroup } from 'src/shared/enums/role-group.enum';
import { IFilterDto } from 'src/shared/utils/filter-dto.interface';

export class FilterUserDto implements IFilterDto<User> {
    @ApiProperty({ default: '', required: false })
    search?: string;

    @ApiProperty({ required: false, default: 1 })
    page?: number;

    @ApiProperty({ required: false, default: 10 })
    pageSize?: number;

    @ApiProperty({ required: false, enum: ['username', 'firstName', 'lastName', 'emailAddress', 'createdAt'], default: 'createdAt' })
    orderBy?: keyof User; // Now constrained to User properties

    @ApiProperty({ required: false, enum: ['ASC', 'DESC'], default: 'DESC' })
    orderDirection?: 'ASC' | 'DESC';

    @ApiProperty({ required: false })
    isActive?: boolean

    @ApiProperty({ required: false, enum: RoleGroup })
    roleGroup?: RoleGroup
}
