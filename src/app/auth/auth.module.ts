import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, Permission, Role } from "src/database/entities";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies"; //#TODO: create a strategy for the jwt
// import { RolesGuard } from "./guards/roles.guard"; //#TODO: create a guard for the roles
import { getConfig } from "src/shared/config";

const config = getConfig();
@Module({
  imports: [
    PassportModule,
    /* #TODO: add the imports for the jwt 
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: config.jwt.JWT_SECRET }), */
    TypeOrmModule.forFeature([User, Permission, Role]),
  ],
  providers: [AuthService, LocalStrategy /* JwtStrategy, RolesGuard #TODO*/],
  controllers: [AuthController],
  // exports: [JwtStrategy, PassportModule], // #TODO I don't know if I need this
})
export class AuthModule { }