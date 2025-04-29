import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { Tenant, User } from 'src/database/entities';

@Module({
    controllers: [TenantsController],
    providers: [TenantsService],
    imports: [TypeOrmModule.forFeature([Tenant, User])]
})
export class TenantModule { }
