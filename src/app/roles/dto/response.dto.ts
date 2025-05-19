import { ApiProperty } from "@nestjs/swagger";
import { RoleGroup } from "src/shared/enums";
import { RolePermission } from "src/database/entities";
import { Expose, plainToInstance, Transform } from 'class-transformer';
import { UserDto } from "src/app/users/dto/response.dto";

abstract class ResponseBaseRoleDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty({ nullable: false, enum: RoleGroup })
    @Expose()
    group: RoleGroup;

    @ApiProperty({ nullable: true })
    @Expose()
    updatedAt?: Date;
}

export class RoleDto extends ResponseBaseRoleDto { }

export class RoleDetailDto extends ResponseBaseRoleDto {

    @ApiProperty({ type: [UserDto] }) // #TODO: Omit<UserDto, 'roleName'>[]
    @Transform(({ obj }) => plainToInstance(UserDto, obj.users, { strategy: 'excludeAll' }))
    @Expose()
    users: UserDto[] = []

    //#TODO excludeExtraneousValues: true'lari ve expose'lari kaldir. Because of this:
    /* Indicates if extraneous properties should be excluded from the value when converting a plain value to a class.
    *
    * This option requires that each property on the target class has at least one `@Expose` or `@Exclude` decorator
    * assigned from this library.
    */
    //excludeExtraneousValues?: boolean; 
    @ApiProperty({ type: [RolePermission] })
    @Expose()
    @Transform(({ obj }) => plainToInstance(RolePermission, obj.rolePermissions))
    rolePermissions: RolePermission[] = []
} 