import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission, Role, RolePermission, User } from '../entities';
import { SeedService } from './seeds.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Role, Permission, RolePermission])],
    providers: [SeedService],
})
export class SeedModule { }