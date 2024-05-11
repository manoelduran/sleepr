import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants';
import { UserDto } from '../dto';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
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
    return this.authClient
      .send<UserDto>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((response) => {
          context.switchToHttp().getRequest().user = response;
        }),
        map(() => true),
        catchError(() => of(false)),
      );
  }
}
