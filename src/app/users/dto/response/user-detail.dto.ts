import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { BaseUserDto } from "../base-user.dto";
import { Role } from "src/database/entities/role.entity";

export class UserDetailDto extends BaseUserDto {

    @IsUUID()
    @ApiProperty()
    id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt?: Date;

    @IsUUID()
    @ApiProperty()
    role: Role;
}