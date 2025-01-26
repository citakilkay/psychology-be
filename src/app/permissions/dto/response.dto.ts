import { ApiProperty } from "@nestjs/swagger";
import { Permission } from "src/database/entities";

abstract class ResponseBasePermissionDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ default: false })
    isDefault?: boolean = false;

    @ApiProperty({ default: true })
    isEditable?: boolean = true;
}

export class PermissionDto extends ResponseBasePermissionDto {
    @ApiProperty()
    updatedAt?: Date;

    @ApiProperty({ type: Permission, description: 'Parent Permission' })
    parent?: Permission;
}

export class PermissionDetailDto extends ResponseBasePermissionDto {
    @ApiProperty()
    updatedAt?: Date;

    @ApiProperty({ type: [Permission], description: 'Array of child permission' })
    childPermissions: Permission[] = []

    @ApiProperty({ type: Permission, description: 'Parent Permission' })
    parent?: Permission;
} 