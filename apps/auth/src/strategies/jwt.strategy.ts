import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../interfaces/token-payloade.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configservice: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      secretOrKey: configservice.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Authentication ||
          request?.Authentication ||
          request?.headers.Authentication,
      ]),
    });
  }

  async validate({ userId }: TokenPayload): Promise<any> {
    return await this.userService.getUser({ _id: userId });
  }
}
