import { Global, Module } from '@nestjs/common';

import { redisProviders } from './redis-helper.providers';
import { RedisHelperService } from './redis-helper.service';

@Global()
@Module({
  providers: [...redisProviders, RedisHelperService],
  exports: [...redisProviders, RedisHelperService],
})
export class RedisHelperModule {}
