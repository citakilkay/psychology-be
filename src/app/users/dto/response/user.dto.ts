import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { BaseUserDto } from "../common/base-user.dto";
import { Transform } from "class-transformer";

export class UserDto extends BaseUserDto {

    @IsUUID()
    @ApiProperty()
    id: string;
    @ApiProperty()
    createdAt: Date;

    @IsUUID()
    @ApiProperty()
    @Transform(({ obj }) => obj.role?.name ?? null)
    roleName: string;
}