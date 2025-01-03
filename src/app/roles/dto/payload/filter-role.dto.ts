import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/database/entities/role.entity';
import { RoleGroup } from 'src/shared/enums/role-group.enum';
import { IFilterDto } from 'src/shared/utils/filter-dto.interface';

const ORDER_BY_KEYS = ['name', 'createdAt', 'updatedAt'] as const;
type OrderByKeys = typeof ORDER_BY_KEYS[number]
export class FilterRoleDto implements IFilterDto<Role, OrderByKeys> {
    @ApiProperty({ default: '', required: false })
    search?: string;

    @ApiProperty({ required: false, default: 1 })
    page?: number;

    @ApiProperty({ required: false, default: 10 })
    pageSize?: number;

    @ApiProperty({ required: false, enum: ORDER_BY_KEYS, default: 'createdAt' })
    orderBy?: OrderByKeys;

    @ApiProperty({ required: false, enum: ['ASC', 'DESC'], default: 'DESC' })
    orderDirection?: 'ASC' | 'DESC';

    @ApiProperty({ required: false, enum: RoleGroup })
    roleGroup?: RoleGroup
}
