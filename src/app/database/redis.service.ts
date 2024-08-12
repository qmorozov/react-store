import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';
import environment from '../configuration/configuration.env';

export enum RedisNamespace {
  UserOnline = 'user-online',
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private connected = false;

  private readonly client = environment.redis.enabled
    ? createClient({
        url: `redis://${environment.redis.host}:${environment.redis.port}`,
        username: environment.redis.username,
        password: environment.redis.password,
        database: environment.redis.db,
      })
    : null;

  private readonly logger = new Logger(RedisService.name);

  public namespace(name: RedisNamespace) {
    const gName = (key: string) => [name, key].join('::');
    return {
      get: (key: string) => {
        return this.connected && this.client.get(gName(key));
      },
      set: (key: string, value: string | number, options?) => {
        return this.connected && this.client.set(gName(key), value, options);
      },
    };
  }

  async onModuleInit() {
    this.logger.log('Connecting to Redis...');

    if (!environment.redis.enabled) {
      return (this.connected = false);
    }

    this.client.on('error', (e) => {
      this.logger.error(e);
      return (this.connected = false);
    });

    return this.client
      .connect()
      .then(() => {
        this.logger.log('Connecting to Redis DONE');
        return (this.connected = true);
      })
      .catch((e) => {
        this.logger.error(e);
        return (this.connected = false);
      });
  }

  onModuleDestroy() {
    return this.client?.quit();
  }
}
