import { Global, Module } from '@nestjs/common';
import { RedisService } from './services/redis.service';
import { RedisClientUserFactory } from './factories/redis.factory';
import { RedisRepository } from './repositories/redis.repository';
@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [RedisClientUserFactory, RedisRepository, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
