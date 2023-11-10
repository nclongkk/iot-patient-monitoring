import { Provider } from '@nestjs/common';
import * as Redis from 'redis';
import { REDIS_CLIENT } from './redis-helper.constant';

export type RedisClient = ReturnType<typeof Redis.createClient>;

export const redisProviders: Provider[] = [
  {
    useFactory: async (): Promise<RedisClient> => {
      const client = Redis.createClient({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      });
      await client.connect();
      return client;
    },
    provide: REDIS_CLIENT,
  },
];
