import { ApiProperty } from "@nestjs/swagger";
import { plainToInstance, Transform } from "class-transformer";

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
}

export class PermissionDetailDto extends ResponseBasePermissionDto {
    @ApiProperty()
    updatedAt?: Date;

    @ApiProperty({ type: [PermissionDto], description: 'Array of child permission' })
    @Transform(({ obj }) => plainToInstance(PermissionDto, obj.childPermissions, { groups: ['updatedAt', 'isDefault', 'isEditable', 'id', 'createdAt', 'name', 'description'] }))
    childPermissions: PermissionDto[] = [] //#TODO group ile isteneni veriyor mu

    @ApiProperty({ type: PermissionDto, description: 'Parent Permission' })
    @Transform(({ obj }) => plainToInstance(PermissionDto, obj.parent, { groups: ['updatedAt', 'isDefault', 'isEditable', 'id', 'createdAt', 'name', 'description'] }))
    parent?: PermissionDto;
} 