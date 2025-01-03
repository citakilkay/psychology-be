import { IsUUID } from "class-validator";
import { BaseRoleDto } from "../common/base-role.dto";
import { ApiProperty } from "@nestjs/swagger";

export class RoleDto extends BaseRoleDto {
    @IsUUID()
    @ApiProperty()
    id?: string;

    @ApiProperty({ nullable: true })
    createdAt: Date;

    @ApiProperty({ nullable: true })
    updatedAt?: Date;
}