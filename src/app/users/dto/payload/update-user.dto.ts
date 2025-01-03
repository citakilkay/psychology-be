import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { BaseUserDto } from "../common/base-user.dto";

export class UpdateUserDto extends BaseUserDto {

    @IsUUID()
    @ApiProperty()
    roleId?: string;
}