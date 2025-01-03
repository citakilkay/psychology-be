import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { BaseUserDto } from "../common/base-user.dto";
import { Transform } from "class-transformer";

export class UserDto extends BaseUserDto {

    id: string;

    createdAt: Date;

    @IsUUID()
    @ApiProperty()
    userId: string;

    @IsUUID()
    @ApiProperty()
    @Transform(({ obj }) => obj.role?.name ?? null)
    roleName: string;
}