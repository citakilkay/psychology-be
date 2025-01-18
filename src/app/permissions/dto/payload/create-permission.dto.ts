import { ApiProperty } from "@nestjs/swagger";
import { BasePermissionDto } from "../base-permission.dto";

export class CreatePermissionDto extends BasePermissionDto {
    @ApiProperty()
    parentId?: string;
}