import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/database/entities/user.entity";
import { getConfig } from "src/shared/config";
import { JwtPayload, ReqUser } from "../dto";
import { AuthService } from "../auth.service";

const config = getConfig();
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
    ) {
        super({
            secretOrKey: config.jwt.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: JwtPayload): Promise<ReqUser> {
        const user = await this.authService.validateJwtUser(payload.id);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // if (!user.isActive) { #TODO isActive ise kismi erisebilir
        //     throw new UnauthorizedException('User is not active');
        // }

        return user; // #TEST burasi request.user mi oluyor? Ve diger strategy'lerin dondurdugu de oluyor mu? Eger oluyorsa hepsini JwtPayload seklinde dondur.
    }
}