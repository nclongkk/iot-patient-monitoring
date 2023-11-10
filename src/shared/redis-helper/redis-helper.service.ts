import * as _ from 'lodash';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { RedisClient } from './redis-helper.providers';
import { REDIS_CLIENT } from './redis-helper.constant';

@Injectable()
export class RedisHelperService {
  private isEnableCacheTikTokData;
  constructor(
    @Inject(REQUEST) private request,
    @Inject(REDIS_CLIENT) public client: RedisClient,
  ) {}

  setKey(key, data, ttl = 0) {
    if (!_.isObject(data)) {
      throw new BadRequestException({
        i18nKey: 'error.unexpected_cache_data',
      });
    }

    if (!ttl) {
      ttl = (Math.floor(Math.random() * 5) + 3) * 1000;
    }

    key = `${process.env.NODE_ENV}:${key}`;
    const parseKey = encodeURIComponent(key);

    return this.client.set(parseKey, JSON.stringify(data), {
      EX: ttl,
    });
  }

  async getKey(key): Promise<any> {
    key = `${process.env.NODE_ENV}:${key}`;
    const parseKey = encodeURIComponent(key);
    const value = await this.client.get(`${parseKey}`);
    return JSON.parse(value);
  }

  deleteKey(key) {
    key = `${process.env.NODE_ENV}:${key}`;
    const parseKey = encodeURIComponent(key);
    return this.client.del(parseKey);
  }
}
