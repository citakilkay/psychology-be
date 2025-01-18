import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsUUID } from "class-validator";

abstract class PayloadBasePermissionDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ default: false })
    isDefault?: boolean = false;

    @ApiProperty({ default: true })
    isEditable?: boolean = true;
}

export class CreatePermissionDto extends PayloadBasePermissionDto {
    @ApiProperty()
    parentId?: string;
}

export class UpdatePermissionDto extends PayloadBasePermissionDto {
    @ApiProperty({ type: [String], description: 'Array of permission UUIDs' })
    @IsArray()
    @IsUUID('all', { each: true, message: 'Each value in the array must be a valid UUID' })
    childPermissionIds: string[] = []
} 