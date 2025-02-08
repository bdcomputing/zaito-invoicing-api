import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppService } from './app.service';
import { AuthenticationModule } from './auth/authentication.module';
import { WsJwtGuard } from './auth/guards/ws-jwt.guard';
import { AuthorizationModule } from './authorization/authorization.module';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { BanksModule } from './banks/banks.module';
import { CompanyAccountsModule } from './company-accounts/company-accounts.module';
import { CronJobsModule } from './cron-jobs/cron-jobs.module';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { FileManagerModule } from './file-manager/file-manager.module';
import { LoggerModule } from './logger/logger.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OtpModule } from './otp/otp.module';
import { QueuesModule } from './queues/queues.module';
import { SettingsModule } from './settings/settings.module';
import { SetupModule } from './setup/setup.module';
import { SocketGatewayModule } from './sockets/gateway.module';
import { TaskManagerModule } from './task-manager/task-manager.module';
import { UsersModule } from './users/users.module';
import { DefaultModules } from './default-modules';
import { LoggerMiddleware } from './logger/middlewares/logger.middleware';
import { AirtelMoneyModule } from './payments/airtel-money/airtel-money.module';
import { RegionsModule } from './regions/regions.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigService } from '@nestjs/config';
import { GenerateRedisURL } from './redis/helpers/redis-url.helper';
import { PatientsModule } from './patients/patients.module';
@Module({
  controllers: [AppController],
  imports: [
    ...DefaultModules,
    SetupModule,
    NotificationsModule,
    UsersModule,
    SettingsModule,
    OtpModule,
    AuthenticationModule,
    AuthorizationModule,
    // MpesaModule,
    BanksModule,
    BankAccountsModule,
    CronJobsModule,
    FileManagerModule,
    EventsModule,
    CompanyAccountsModule,
    QueuesModule,
    TaskManagerModule,
    SocketGatewayModule,
    DatabaseModule,
    LoggerModule,
    PatientsModule,
    AirtelMoneyModule,
    RegionsModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (config) => {
        const url: string = GenerateRedisURL();
        const store = await redisStore({
          ttl: config.get('CACHE_TTL') * 1000,
          url,
        });

        return { store };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [BullModule],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: WsJwtGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
