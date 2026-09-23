import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

export const RedisProvider: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService) => {
    const client = new Redis(configService.getOrThrow<string>('redis.url'), {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
    return client;
  },
  inject: [ConfigService]
};
