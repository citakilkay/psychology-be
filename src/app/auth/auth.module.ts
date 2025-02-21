import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, Permission, Role } from "src/database/entities";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy, LocalStrategy } from "./strategies"; //#TODO: create a strategy for the jwt
// import { RolesGuard } from "./guards/roles.guard"; //#TODO: create a guard for the roles
import { getConfig } from "src/shared/config";
import { JwtModule } from "@nestjs/jwt";

const config = getConfig();
@Module({
  imports: [
    PassportModule,
    /* #TODO: add the imports for the jwt */
    PassportModule.register({ defaultStrategy: 'jwt' }), // #TODO: session: true
    JwtModule.register({ secret: config.jwt.JWT_SECRET, signOptions: { expiresIn: '72h' } }),
    TypeOrmModule.forFeature([User, Permission, Role]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy /* , RolesGuard #TODO*/],
  controllers: [AuthController],
  // exports: [JwtStrategy, PassportModule], // #TODO I don't know if I need this
})
export class AuthModule { }