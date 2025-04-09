import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, Permission, Role, Usership } from "src/database/entities";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy, LocalStrategy } from "./strategies";
// import { RolesGuard } from "./guards/roles.guard"; //#TODO: create a guard for the roles
import { getConfig } from "src/shared/config";
import { JwtModule } from "@nestjs/jwt";
import { RefreshJwtStrategy } from "./strategies/refresh.strategy";

const config = getConfig();
@Module({
  imports: [
    PassportModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), // #TODO: session: true
    JwtModule.register({ secret: config.jwt.JWT_SECRET, signOptions: { expiresIn: config.jwt.JWT_EXPIRED_IN_HOURS + 'h' } }),
    TypeOrmModule.forFeature([User, Permission, Role, Usership]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshJwtStrategy /* , RolesGuard #TODO*/],
  controllers: [AuthController],
   exports: [JwtStrategy, PassportModule], // #TODO I don't know if I need this
})
export class AuthModule { }

// kalan yerden youtube sakura
// strategy icinde kullanilan functionlar controller icinde kullanilan functionlar ile ayni yerde olması dogru mu? CHATGPT
// + user logout olunca refresh token ve access token invalid hale geldiginden emin ol.
// + implement a login date
// + signout
// roles guard (youtube)
// getUser decorator
// seed service
// 3 module tamamladiktan sonra test caseler yaz madde madde hepsini yap. Break pointler ile birlikte.