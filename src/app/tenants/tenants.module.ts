import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { Role, Tenant, User } from 'src/database/entities';

@Module({
  controllers: [TenantsController],
  providers: [TenantsService],
  imports: [TypeOrmModule.forFeature([Tenant, User, Role])],
})
export class TenantModule {}
