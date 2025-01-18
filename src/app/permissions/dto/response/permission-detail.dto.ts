import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { Permission } from "src/database/entities";
import { BasePermissionDto } from "../base-permission.dto";


export class PermissionDetailDto extends BasePermissionDto {

    @IsUUID()
    @ApiProperty()
    id: string;

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt?: Date

    @ApiProperty({ type: [Permission], description: 'Array of child permission' })
    childPermissions: Permission[] = []

    @ApiProperty({ type: Permission, description: 'Parent Permission' })
    parent?: Permission
}