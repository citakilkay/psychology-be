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
    @ApiProperty()
    @Expose({ groups: ['userservice'] })
    @Transform(({ obj }) => obj.role.name)
    roleName: string;

    @ApiProperty({ nullable: true })
    @Expose({ groups: ['userservice'] })
    updatedAt?: Date;

    @ApiProperty({ nullable: true })
    @Expose({ groups: ['userservice'] })
    @Transform(({ obj }) => obj.usership.lastLoginDate) // #TEST -- diger endpoinlerde gelmesin role endpointlerinde
    lastLoginDate?: Date;

    @ApiProperty({ nullable: true })
    @Expose({ groups: ['userservice'] })
    @Transform(({ obj }) => obj.usership.updatedAt) // #TEST -- diger endpoinlerde gelmesin role endpointlerinde
    lastActivityDate?: string; // #TEST niye stringdi burası
}

export class UserDetailDto extends ResponseBaseUserDto {
    @ApiProperty({ nullable: true })
    updatedAt?: Date;

    @ApiProperty({ type: RoleDto })
    @Transform(({ obj }) => plainToInstance(RoleDto, obj.role, { excludeExtraneousValues: true }))
    @Expose()
    role: RoleDto;
    @ApiProperty({ nullable: true })
    @Transform(({ obj }) => obj.usership.lastLoginDate) // #TEST 
    lastLoginDate?: Date;

    @ApiProperty({ nullable: true })
    @Transform(({ obj }) => obj.usership.updatedAt) // #TEST
    lastActivityDate?: string;
} 