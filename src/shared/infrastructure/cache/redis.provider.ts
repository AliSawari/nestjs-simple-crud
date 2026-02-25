import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';
export const TTL_DEFAULT = (60 * 60); // ttl in redis is in seconds, not ms

export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const client = new Redis({
      host: config.get('REDIS_HOST'),
      port: config.get('REDIS_PORT'),
    });

    client.on('connect', () => console.log('Redis connected'));
    client.on('error', (err) => console.error('Redis error', err));

    return client;
  },
};