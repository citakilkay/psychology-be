import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, Matches, MinLength } from "class-validator";
import { BaseUserDto } from "../common/base-user.dto";
import { Role } from "src/database/entities/role.entity";

export class UserDetailDto extends BaseUserDto {

    id: string;

    createdAt: Date;

    updatedAt?: Date;

    @ApiProperty()
    @MinLength(6, { message: 'Password must have at least 6 character' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,}$/, { message: 'Password must have at least one letter and one number' })
    password: string;

    @IsUUID()
    @ApiProperty()
    role: Role;
}