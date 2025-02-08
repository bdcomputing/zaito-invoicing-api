// import {
//   Injectable,
//   OnApplicationBootstrap,
//   OnApplicationShutdown,
// } from '@nestjs/common';
// import Redis from 'ioredis';

// export class InvalidatedRefreshTokenError extends Error {
//   //
// }

// @Injectable()
// export class RefreshTokenIdsStorage
//   implements OnApplicationBootstrap, OnApplicationShutdown
// {
//   private redisBackOfficeUser: Redis;

//   /**
//    * initialize the imports
//    * @param configService
//    */

//   /**
//    * On application startup, run this lifecycle hook
//    */
//   onApplicationBootstrap() {
//     const hasPassword = process.env.REDIS_HAS_PASSWORD
//       ? JSON.parse(process.env.REDIS_HAS_PASSWORD)
//       : false;

//     const selfHosted: boolean = process.env.REDIS_SELF_HOSTED
//       ? JSON.parse(process.env.REDIS_SELF_HOSTED)
//       : false;
//     const REDIS_HOST = process.env.REDIS_HOST;
//     const REDIS_PORT = +process.env.REDIS_PORT;
//     const REDIS_USERNAME = process.env.REDIS_USERNAME;
//     const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
//     const base = selfHosted ? 'redis://' : 'rediss://';

//     const REDIS_URL = hasPassword
//       ? `${base}${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`
//       : `${base}${REDIS_HOST}:${REDIS_PORT}`;

//     const isLocal =
//       REDIS_URL.includes('127.0.0.1') ||
//       REDIS_URL.includes('localhost') ||
//       REDIS_URL.includes('redis://');

//     this.redisBackOfficeUser = isLocal
//       ? new Redis(REDIS_URL)
//       : new Redis(REDIS_URL, {
//           maxRetriesPerRequest: null,
//           tls: {},
//         });
//   }

//   async onApplicationShutdown() {
//     return await this.redisBackOfficeUser.quit();
//   }

//   /**
//    * Save the refresh token to redis
//    * @param userId
//    * @param tokenId
//    */
//   async insert(userId: number, tokenId: string): Promise<any> {
//     const clientInstance = await this.redisBackOfficeUser.set(
//       this.getKey(userId),
//       tokenId,
//     );
//     return clientInstance;
//   }

//   async validate(userId: number, tokenId: string): Promise<boolean> {
//     const storedId = await this.redisBackOfficeUser.get(this.getKey(userId));
//     if (storedId !== tokenId) {
//       throw new InvalidatedRefreshTokenError();
//     }
//     return storedId === tokenId;
//   }

//   async invalidate(userId: number): Promise<void> {
//     await this.redisBackOfficeUser.del(this.getKey(userId));
//   }

//   private getKey(userId: number): string {
//     return `user-${userId}`;
//   }
// }
