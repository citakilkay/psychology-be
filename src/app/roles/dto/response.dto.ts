import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { RoleGroup } from "src/shared/enums/role-group.enum";
import { RolePermission, User } from "src/database/entities";

abstract class ResponseBaseRoleDto {
    @IsUUID()
    @ApiProperty()
    id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    name: string;

    @ApiProperty({ nullable: false, enum: RoleGroup })
    group: RoleGroup;

}

export class RoleDto extends ResponseBaseRoleDto { }

export class RoleDetailDto extends ResponseBaseRoleDto {
    @ApiProperty({ nullable: true })
    updatedAt?: Date;

    @ApiProperty({ nullable: true })
    users: User[] = []

    @ApiProperty({ nullable: true })
    rolePermissions: RolePermission[] = []
} 