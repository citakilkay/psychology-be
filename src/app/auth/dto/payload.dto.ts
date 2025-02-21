import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsUUID, Matches, MinLength } from "class-validator";

export class LoginCredentialsDto {
    @ApiProperty()
    @MinLength(6, { message: 'Username or email address is too short' })
    usernameOrEmailAddress: string;

    @ApiProperty()
    @MinLength(6, { message: 'Password must have at least 6 character' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,}$/, { message: 'Password must have at least one letter and one number' })
    password: string;

    @ApiProperty({ default: false }) // #TODO:  add rememberme
    @IsBoolean()
    rememberMe: boolean = false;
}

export class RegisterCredentialsDto {
    @ApiProperty()
    @MinLength(6, { message: 'Username is too short' })
    username: string;

    @ApiProperty({ nullable: true })
    firstName?: string;

    @ApiProperty({ nullable: true })
    lastName?: string;

    @IsUUID()
    @ApiProperty()
    roleId: string;

    @ApiProperty()
    @MinLength(6, { message: 'Password must have at least 6 character' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,}$/, { message: 'Password must have at least one letter and one number' })
    password: string;

    @ApiProperty()
    @IsEmail({}, { message: 'Email address is not valid' })
    emailAddress: string;
}
