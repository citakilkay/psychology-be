import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, MinLength } from "class-validator";
import { Column } from "typeorm";

export abstract class BaseUserDto {
    @ApiProperty()
    @MinLength(6, { message: 'Username is too short' })
    username: string;

    @Column({ nullable: true })
    firstName?: string;

    @Column({ nullable: true })
    lastName?: string;

    @ApiProperty()
    isActive: boolean = false;

    @ApiProperty()
    @IsOptional()
    @IsEmail({}, { message: 'Email address is not valid' })
    emailAddress: string;
}