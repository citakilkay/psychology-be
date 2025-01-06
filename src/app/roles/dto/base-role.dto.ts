import { ApiProperty } from "@nestjs/swagger";
import { RoleGroup } from "src/shared/enums/role-group.enum";

export abstract class BaseRoleDto {
    @ApiProperty()
    name: string;

    @ApiProperty({ nullable: false, enum: RoleGroup })
    group: RoleGroup;
}