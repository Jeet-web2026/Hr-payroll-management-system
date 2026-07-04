import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as express from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'default_secret',
      passReqToCallback: true,
    });
  }

  async validate(req: express.Request, payload: any) {
    const authToken = req.headers.authorization?.split(' ')[1];
    const refreshToken = req.cookies['refreshToken'];

    if (!authToken || !refreshToken) {
      throw new UnauthorizedException(
        'Login expired or invalidated. Please log in again.',
      );
    }

    const isBlacklisted = await this.cacheManager.get(`blacklist:${authToken}`);

    if (isBlacklisted) {
      throw new UnauthorizedException(
        'Login expired or invalidated. Please log in again.',
      );
    }

    return {
      id: payload.sub,
      role: payload.role,
      status: payload.status,
    };
  }
}
