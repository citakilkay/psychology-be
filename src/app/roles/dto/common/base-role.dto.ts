import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, MinLength } from "class-validator";
import { Permission } from "src/database/entities/permission.entity";
import { User } from "src/database/entities/user.entity";
import { RoleGroup } from "src/shared/enums/role-group.enum";
import { Column } from "typeorm";

export abstract class BaseRoleDto {
    @ApiProperty()
    name: string;

    @ApiProperty({ enum: RoleGroup })
    @Column({ nullable: false, type: "enum", enum: RoleGroup })
    group: RoleGroup;
}