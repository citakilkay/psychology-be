import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { UsersModule } from './app/users/users.module';
import { PermissionsModule } from './app/permissions/permissions.module';
import { RolesModule } from './app/roles/roles.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './app/auth/auth.module';
import { getConfig } from './shared/config';
import { SeedModule } from './database/seeds/seeds.module';
import { SeedService } from './database/seeds/seeds.service';

const config = getConfig();
const autoLoadEntities = config.db.AUTO_LOAD_ENTITIES;
const synchronize = config.db.SYNCHRONIZE;
const sslRejectUnauthorized = config.db.SSL_REJECT_UNAUTHORIZED;

@Module({
  imports: [SeedModule, UsersModule, PermissionsModule, RolesModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities,
        synchronize,
        ssl: {
          rejectUnauthorized: sslRejectUnauthorized,
        }
      }),
      inject: [ConfigService, SeedService],
    })]
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seedService: SeedService
  ) { }

  async onModuleInit() {
    await this.seedService.seed();
  }

}
