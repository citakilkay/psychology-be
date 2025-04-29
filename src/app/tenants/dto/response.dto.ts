import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";

export class TenantDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    name: string;

    @ApiProperty({ nullable: true })
    @Expose()
    updatedAt?: Date;

    @Expose({ groups: ['tenantService'] })
    @Transform(({ obj }) =>
        obj.admin
            ? {
                username: obj.admin.username,
                firstName: obj.admin.firstName,
                lastName: obj.admin.lastName,
            }
            : null
    )
    admin?: {
        username: string;
        firstName?: string;
        lastName?: string;
    }

}