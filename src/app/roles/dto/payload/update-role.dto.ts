import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsUUID } from "class-validator";
import { BaseRoleDto } from "../base-role.dto";

export class UpdateRoleDto extends BaseRoleDto {

    @ApiProperty({ type: [String], description: 'Array of permission UUIDs' })
    @IsArray()
    @IsUUID('all', { each: true, message: 'Each value in the array must be a valid UUID' })
    rolePermissionIds: string[] = []
}