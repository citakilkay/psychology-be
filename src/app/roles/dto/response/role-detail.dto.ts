import { IsUUID } from "class-validator";
import { BaseRoleDto } from "../common/base-role.dto";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { Permission, User } from "src/database/entities";

export class RoleDetailDto extends BaseRoleDto {
    @IsUUID()
    @ApiProperty()
    id?: string;

    @ApiResponseProperty()
    createdAt: Date;

    @ApiResponseProperty()
    updatedAt?: Date;

    @ApiProperty({ nullable: true })
    users: User[] = [] // #TEST -- password exclude ediliyor mu kontrol et. Ediliyorsa UserDto olarak değistir burayi

    @ApiProperty({ nullable: true })
    permissions: Permission[] = []
}