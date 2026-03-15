import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { getConfig } from 'src/shared/config';
import { JwtPayload, ReqUser } from '../dto';
import { AuthService } from '../auth.service';

const config = getConfig();
@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: (req: Request) => {
        const token = req?.cookies?.refreshToken;
        if (!token) return null;
        return token;
      },
      secretOrKey: config.jwt.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): Promise<ReqUser> {
    const refreshToken = req.cookies?.refreshToken;
    const userId = payload.id;
    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}
