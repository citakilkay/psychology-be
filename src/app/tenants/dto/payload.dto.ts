import { ApiProperty } from "@nestjs/swagger";
import { Tenant } from "src/database/entities";
import { IFilterDto } from "src/shared/utils/filter-dto.interface";

const ORDER_BY_KEYS = ['createdAt', 'name', 'tenantUrlTag', 'fullBrandName'] as const;
type OrderByKeys = typeof ORDER_BY_KEYS[number]

export class FilterTenantDto implements IFilterDto<Tenant, OrderByKeys> {
    @ApiProperty({ default: '', required: false })
    search?: string;

    @ApiProperty({ required: false, default: 1 })
    page?: number;

    @ApiProperty({ required: false, default: 10 })
    pageSize?: number;

    @ApiProperty({ required: false, enum: ORDER_BY_KEYS, default: ORDER_BY_KEYS[0] })
    orderBy?: OrderByKeys;

    @ApiProperty({ required: false, enum: ['ASC', 'DESC'], default: 'DESC' })
    orderDirection?: 'ASC' | 'DESC' = 'DESC';

    @ApiProperty({ required: false })
    isActive?: boolean
} 