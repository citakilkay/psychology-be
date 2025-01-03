import { IsUUID } from "class-validator";
import { BaseRoleDto } from "../common/base-role.dto";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";
import { User } from "src/database/entities/user.entity";
import { Permission } from "src/database/entities/permission.entity";

export class RoleDetailDto extends BaseRoleDto {
    @IsUUID()
    @ApiProperty()
    id?: string;

    @ApiResponseProperty()
    createdAt: Date;

    @ApiResponseProperty()
    updatedAt?: Date;

    @ApiProperty({ nullable: true })
    users: User[]

    @ApiProperty({ nullable: true })
    permissions: Permission[]
}