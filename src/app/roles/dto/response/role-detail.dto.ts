import { IsUUID } from "class-validator";
import { BaseRoleDto } from "../base-role.dto";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { RolePermission, User } from "src/database/entities";

export class RoleDetailDto extends BaseRoleDto {
    @IsUUID()
    @ApiProperty()
    id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt?: Date;

    @ApiProperty({ nullable: true })
    users: User[] = [] // #TEST -- password exclude ediliyor mu kontrol et. Ediliyorsa UserDto olarak değistir burayi

    @ApiProperty({ nullable: true })
    rolePermissions: RolePermission[] = [] // #TEST -- RolePermissionlara bak
}