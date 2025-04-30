import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsUUID, MinLength, ValidateNested } from "class-validator";
import { ContactInfo, Tenant } from "src/database/entities";
import { IFilterDto } from "src/shared/utils/filter-dto.interface";



abstract class PayloadBaseTenantDto {
    @ApiProperty()
    @MinLength(3, { message: 'Name is too short' })
    name: string;

    @ApiProperty()
    @MinLength(3, { message: 'Full Brand Name is too short' })
    fullBrandName: string;

    @ApiProperty()
    @MinLength(3, { message: 'Tenant Url Tag is too short' })
    tenantUrlTag: string;

    @ApiProperty()
    @IsUUID()
    adminId: string;

    @ApiProperty()
    @IsOptional()
    @ValidateNested()
    @Type(() => ContactInfo)
    contactInfo?: ContactInfo;

}

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

export class CreateTenantDto extends PayloadBaseTenantDto {

}

export class UpdateTenantDto extends PayloadBaseTenantDto {
    @ApiProperty()
    isActive: boolean;

}