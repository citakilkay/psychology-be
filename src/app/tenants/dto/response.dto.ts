import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import { UserDto } from 'src/app/users/dto/response.dto';
import { ContactInfo } from 'src/database/entities';

abstract class ResponseBaseTenantDto {
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
}
export class TenantDto extends ResponseBaseTenantDto {
  @Expose()
  @Transform(({ obj }) =>
    obj.admin
      ? {
          username: obj.admin.username,
          firstName: obj.admin.firstName,
          lastName: obj.admin.lastName,
          userId: obj.admin.id,
        }
      : null,
  )
  admin?: {
    username: string;
    firstName?: string;
    lastName?: string;
    userId: string;
  };
}

export class TenantDetailDto extends ResponseBaseTenantDto {
  @ApiProperty({ type: UserDto }) // #TODO: Omit<UserDto, 'roleName'>[]
  @Transform(({ obj }) =>
    plainToInstance(UserDto, obj.admin, { strategy: 'excludeAll' }),
  )
  @Expose()
  admin?: UserDto;

  @ApiProperty({ type: [UserDto] }) // #TODO: Omit<UserDto, 'roleName'>[]
  @Transform(({ obj }) =>
    plainToInstance(UserDto, obj.users, { strategy: 'excludeAll' }),
  )
  @Expose()
  users: UserDto[] = [];

  @ApiProperty()
  @Expose()
  contactInfo: ContactInfo;
}
