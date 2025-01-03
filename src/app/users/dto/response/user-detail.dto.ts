import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { BaseUserDto } from "../common/base-user.dto";
import { Role } from "src/database/entities/role.entity";

export class UserDetailDto extends BaseUserDto {

    id: string;

    createdAt: Date;

    updatedAt?: Date;

    @IsUUID()
    @ApiProperty()
    role: Role;
}