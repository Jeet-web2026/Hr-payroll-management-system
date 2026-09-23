import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import * as express from 'express';
import { RedisService } from '../../modules/cache/services/redis.service';
import { MAX_ATTEMPT_FOR_AUTHENTICATION, MAX_REQ_SECOND } from '../constraints';

@Injectable()
export class AuthRateLimiterMiddleware implements NestMiddleware {
  private readonly MAX_REQUESTS = MAX_ATTEMPT_FOR_AUTHENTICATION;
  private readonly WINDOW_SECONDS = MAX_REQ_SECOND;

  constructor(private readonly redisService: RedisService) {}

  async use(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const key = `hrp-ip-${req.ip}`;

    const previousData = (await this.redisService.get(key)) ?? 0;
    const count = Number(previousData);

    if (count >= this.MAX_REQUESTS) {
      const ttl = await this.redisService.ttl(key);
      
      throw new HttpException(
        `Too many requests. Please try after ${ttl} seconds later.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.redisService.set(key, count + 1, this.WINDOW_SECONDS);

    next();
  }
}
