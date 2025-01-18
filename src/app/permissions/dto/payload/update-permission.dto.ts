import { ApiProperty } from "@nestjs/swagger";
import { BasePermissionDto } from "../base-permission.dto";
import { IsArray, IsUUID } from "class-validator";

export class UpdatePermissionDto extends BasePermissionDto {

    @ApiProperty()
    parentId?: string;

    @ApiProperty({ type: [String], description: 'Array of permission UUIDs' })
    @IsArray()
    @IsUUID('all', { each: true, message: 'Each value in the array must be a valid UUID' })
    childPermissionIds: string[] = []
}