import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsUUID, Matches, MinLength } from "class-validator";
import { RoleGroup } from "src/shared/enums/role-group.enum";
import { User } from "src/database/entities";
import { IFilterDto } from "src/shared/utils/filter-dto.interface";

abstract class PayloadBaseUserDto {
    @ApiProperty()
    @MinLength(6, { message: 'Username is too short' })
    username: string;

    @ApiProperty({ nullable: true })
    firstName?: string;

    @ApiProperty({ nullable: true })
    lastName?: string;

    @ApiProperty({ default: false })
    isActive: boolean = false;

    @ApiProperty()
    @IsEmail({}, { message: 'Email address is not valid' })
    emailAddress: string;
}

export class CreateUserDto extends PayloadBaseUserDto {
    @ApiProperty()
    @MinLength(6, { message: 'Password must have at least 6 character' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,}$/, { message: 'Password must have at least one letter and one number' })
    password: string;

    @IsUUID()
    @ApiProperty()
    roleId: string;

    @IsUUID()
    @ApiProperty()
    tenantId: string;
}

export class UpdateUserDto extends PayloadBaseUserDto {
    @IsUUID()
    @ApiProperty()
    roleId?: string;
}

export class ChangePasswordDto {
    @ApiProperty()
    oldPassword: string;

    @ApiProperty()
    @MinLength(6, { message: 'Password must have at least 6 character' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,}$/, { message: 'Password must have at least one letter and one number' })
    newPassword: string;

    @ApiProperty()
    newPasswordAgain: string;
}

const ORDER_BY_KEYS = ['createdAt', 'username', 'firstName', 'lastName', 'emailAddress', 'updatedAt', 'roleName'] as const;
type OrderByKeys = typeof ORDER_BY_KEYS[number]

export class FilterUserDto implements IFilterDto<User, OrderByKeys> {
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

    @ApiProperty({ required: false, enum: RoleGroup })
    roleGroup?: RoleGroup
} 