import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT, TTL_DEFAULT } from './redis.provider';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (!value) {
      this.logger.debug(`Cache MISS: ${key}`);
      return null;
    }
    this.logger.debug(`Cache HIT: ${key}`);
    return JSON.parse(value) as T;
  }

  async set(key: string, value: unknown, ttlSeconds = TTL_DEFAULT): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    this.logger.debug(`Cache SET: ${key} (TTL: ${ttlSeconds}s)`);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
    this.logger.debug(`Cache DEL: ${key}`);
  }
}