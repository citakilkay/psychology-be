import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsUUID, MinLength } from "class-validator";
import { Role } from "src/database/entities/role.entity";
import { Transform } from "class-transformer";

abstract class ResponseBaseUserDto {
    @IsUUID()
    @ApiProperty()
    id: string;
    
    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    @MinLength(6, { message: 'Username is too short' })
    username: string;

    @ApiProperty({ nullable: true })
    firstName?: string;

    @ApiProperty({ nullable: true })
    lastName?: string;

    @ApiProperty({ default: false })
    isActive: boolean = false;

    @ApiProperty()
    @IsEmail({}, { message: 'Email address is not valid' })
    emailAddress: string;
} 

export class UserDto extends ResponseBaseUserDto {

    @ApiProperty()
    @Transform(({ obj }) => obj.role?.name ?? null)
    roleName: string;
}

export class UserDetailDto extends ResponseBaseUserDto {

    @ApiProperty()
    updatedAt?: Date;

    @ApiProperty()
    role: Role;
} 