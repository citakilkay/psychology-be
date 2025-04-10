import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission, Role, User } from '../entities';
import { SeederService } from './seeder.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Role, Permission])],
    providers: [SeederService],
})
export class SeederModule { }