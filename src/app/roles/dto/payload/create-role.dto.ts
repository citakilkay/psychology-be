import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsUUID, Matches, MinLength } from "class-validator";
import { BaseRoleDto } from "../common/base-role.dto";

export class CreateRoleDto extends BaseRoleDto {

    @ApiProperty({ type: [String], description: 'Array of permission UUIDs' }) // Swagger decorator for documentation
    @IsArray()
    @IsUUID('all', { each: true, message: 'Each value in the array must be a valid UUID' })
    permissionIds: string[] = []
}