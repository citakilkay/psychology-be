import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, plainToInstance } from "class-transformer";
import { RoleDto } from "src/app/roles/dto/response.dto";

abstract class ResponseBaseUserDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    username: string;

    @ApiProperty({ nullable: true })
    @Expose()
    firstName?: string;

    @ApiProperty({ nullable: true })
    @Expose()
    lastName?: string;

    @ApiProperty({ default: false })
    @Expose()
    isActive: boolean = false;

    @ApiProperty()
    @Expose()
    emailAddress: string;
}

export class UserDto extends ResponseBaseUserDto {
    @Expose()
    @Transform(({ obj }) => obj.role.name)
    roleName: string;

    @ApiProperty({ nullable: true })
    @Expose()
    updatedAt?: Date;
}

export class UserDetailDto extends ResponseBaseUserDto {
    @ApiProperty({ nullable: true })
    updatedAt?: Date;

    @ApiProperty({ type: RoleDto })
    @Transform(({ obj }) => plainToInstance(RoleDto, obj.role))
    @Expose()
    role: RoleDto;
} 