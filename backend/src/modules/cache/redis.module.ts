import { Global, Module } from '@nestjs/common';
import { RedisService } from './services/redis.service';
import { RedisProvider } from '../../comon/providers/redis.provider';

@Global()
@Module({
  providers: [RedisService, RedisProvider],
  exports: [RedisService, RedisProvider]
})
export class RedisModule {}
