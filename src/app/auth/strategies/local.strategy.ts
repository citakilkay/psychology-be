import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { ReqUser } from '../dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'usernameOrEmailAddress',
    });
  }

  async validate(
    usernameOrEmailAddress: string,
    password: string,
  ): Promise<ReqUser> {
    const userData = await this.authService.validateUser(
      usernameOrEmailAddress,
      password,
    );
    return userData;
  }
}
