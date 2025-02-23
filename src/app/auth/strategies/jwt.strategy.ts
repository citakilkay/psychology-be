import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/database/entities/user.entity";
import { Repository } from "typeorm";
import { getConfig } from "src/shared/config";
import { JwtPayload } from "../dto";
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

    async validate(payload: JwtPayload): Promise<User> {
        const user = await this.authService.validateJwtUser(payload.id);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // if (!user.isActive) { #TODO isActive ise kismi erisebilir
        //     throw new UnauthorizedException('User is not active');
        // }

        return user;
    }
}