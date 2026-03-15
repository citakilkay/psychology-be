import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';
import { RoleGroup } from 'src/shared/enums';
import { Role } from 'src/database/entities';
import { IFilterDto } from 'src/shared/utils/filter-dto.interface';

abstract class PayloadBaseRoleDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: false, enum: RoleGroup })
  group: RoleGroup;
}

export class CreateRoleDto extends PayloadBaseRoleDto {}

export class UpdateRoleDto extends PayloadBaseRoleDto {
  @ApiProperty({ type: [String], description: 'Array of permission UUIDs' })
  @IsArray()
  @IsUUID('all', {
    each: true,
    message: 'Each value in the array must be a valid UUID',
  })
  rolePermissionIds: string[] = [];
}

const ORDER_BY_KEYS = ['createdAt', 'name', 'updatedAt'] as const;
type OrderByKeys = (typeof ORDER_BY_KEYS)[number];

export class FilterRoleDto implements IFilterDto<Role, OrderByKeys> {
  @ApiProperty({ default: '', required: false })
  search?: string;

  @ApiProperty({ required: false, default: 1 })
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  pageSize?: number;

  @ApiProperty({
    required: false,
    enum: ORDER_BY_KEYS,
    default: ORDER_BY_KEYS[0],
  })
  orderBy?: OrderByKeys;

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'], default: 'DESC' })
  orderDirection?: 'ASC' | 'DESC' = 'DESC';

  @ApiProperty({ required: false, enum: RoleGroup })
  roleGroup?: RoleGroup;
}
