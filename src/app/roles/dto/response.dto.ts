import { ApiProperty } from "@nestjs/swagger";
import { RoleGroup } from "src/shared/enums/role-group.enum";
import { RolePermission, User } from "src/database/entities";
import { Expose } from 'class-transformer';

abstract class ResponseBaseRoleDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty({ nullable: false, enum: RoleGroup })
    @Expose()
    group: RoleGroup;
}

export class RoleDto extends ResponseBaseRoleDto { }

export class RoleDetailDto extends ResponseBaseRoleDto {
    @ApiProperty({ nullable: true })
    @Expose()
    updatedAt?: Date;

    @ApiProperty({ type: [User] })
    @Expose()
    users: User[] = []

    @ApiProperty({ type: [RolePermission] })
    @Expose()
    rolePermissions: RolePermission[] = []
} 