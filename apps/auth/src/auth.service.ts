import { Injectable } from '@nestjs/common';

import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payloade.interface';
import { User } from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async login(user: User, response: Response) {
    const tokenPayload: TokenPayload = { userId: user.id };
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );
    const token = this.jwtService.sign(tokenPayload);
    response.cookie('Authentication', token, {
      expires,
      httpOnly: true,
    });
    return token;
  }
}
