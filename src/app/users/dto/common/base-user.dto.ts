import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength } from "class-validator";

export abstract class BaseUserDto {
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