import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/database/entities/permission.entity';
import { Role } from 'src/database/entities/role.entity';

@Module({
    controllers: [PermissionsController],
    providers: [PermissionsService],
    imports: [TypeOrmModule.forFeature([Role, Permission])]
})
export class PermissionsModule { }