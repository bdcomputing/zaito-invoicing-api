import { Module } from '@nestjs/common';
import { CacheManagerService } from './services/cache-manager.service';

@Module({
  providers: [CacheManagerService],
  exports: [CacheManagerService],
})
export class CacheManagerModule {}
