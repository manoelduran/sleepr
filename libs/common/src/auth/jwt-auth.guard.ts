import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants';

import { Reflector } from '@nestjs/core';
import { User } from '../models';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt =
      context.switchToHttp().getRequest().cookies.Authentication ||
      context.switchToHttp().getRequest().headers?.authentication;
    // Check if the JWT is present in the request, if not, the user is not authenticated
    if (!jwt) return false;
    // Send the JWT to the auth service to verify it
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    return this.authClient
      .send<User>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((response) => {
          if (roles) {
            for (const role of roles) {
              if (!response.roles.map((role) => role.name).includes(role)) {
                this.logger.error("User doesn't have the required role");
                throw new UnauthorizedException();
              }
            }
          }
          context.switchToHttp().getRequest().user = response;
        }),
        map(() => true),
        catchError((err) => {
          this.logger.error(`${err}`);
          return of(false);
        }),
      );
  }
}
