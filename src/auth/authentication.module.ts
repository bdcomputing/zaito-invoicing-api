import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { PasswordResetController } from './controllers/password-reset.controller';
import { MagicLoginController } from './controllers/magic-login.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { MagicLoginStrategy } from './strategies/magic-login.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { generatePassword } from 'src/shared';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh-token.strategy';
import { AccountLinksController } from './controllers/account-links.controller';
import { RegisterController } from './controllers/register.controller';
import { AccountVerificationController } from './controllers/account-verification.controller';
import { AccountVerificationService } from './services/account-verification.service';

@Global()
@Module({
  controllers: [
    AuthController,
    PasswordResetController,
    MagicLoginController,
    AccountVerificationController,
    AccountLinksController,
    RegisterController,
  ],
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
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
  providers: [
    AuthService,
    JwtStrategy,
    MagicLoginStrategy,
    JwtRefreshTokenStrategy,
    AccountVerificationService,
  ],
})
export class AuthenticationModule {
  //
}
