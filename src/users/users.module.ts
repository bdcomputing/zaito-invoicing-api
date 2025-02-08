import { UserAutomationService } from './services/user-automation.service';
import { Global, Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { userProviders } from './providers/users.provider';
import { EmployeeController } from './controllers/employee.controller';
import { UsersController } from './controllers/users.controller';
import { AuthLogsService } from '../logger/services/auth-logs.service';
import { PasswordService } from './services/passwords.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { generatePassword } from 'src/shared';
import { AccountController } from './controllers/account.controller';

const providers = [
  ...userProviders,
  UsersService,
  PasswordService,
  UserAutomationService,
];
@Global()
@Module({
  controllers: [UsersController, EmployeeController, AccountController],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get('JWT_ACCESS_TOKEN_SECRET') ||
          generatePassword({ includeSpecialChars: true, length: 20 }),
        signOptions: {
          expiresIn: configService.get('AUTH_TOKEN_EXPIRY') || '12h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [...providers, AuthLogsService],
  exports: [...providers],
})
export class UsersModule {
  //
}
