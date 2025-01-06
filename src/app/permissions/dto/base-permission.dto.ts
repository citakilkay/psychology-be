import { ApiProperty } from "@nestjs/swagger";

export abstract class BasePermissionDto {
    @ApiProperty()
    name: string;

    @ApiProperty({ default: false })
    isDefault?: boolean = false;

    @ApiProperty({ default: true })
    isEditable?: boolean = true;
}