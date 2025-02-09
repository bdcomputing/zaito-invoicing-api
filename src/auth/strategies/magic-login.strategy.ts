import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-magic-login';
import { NotificationsService } from 'src/notifications/services/notifications.service';
import { SendEmail } from 'src/notifications/interfaces/email.interface';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/services/users.service';
import { MagicLoginPayload } from '../interfaces/magic-login-payload.interface';
import { MagicLoginLinkTemplate } from 'src/auth/email-templates/magic-link.template';
import { SettingsService } from '../../settings/services/settings.service';
import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class MagicLoginStrategy extends PassportStrategy(Strategy) {
  /**
   *
   */
  constructor(
    private usersService: UsersService,
    private notificationService: NotificationsService,
    private readonly settingsService: SettingsService,
    configService: ConfigService,
  ) {
    super({
      secret:
        configService.get('JWT_ACCESS_TOKEN_SECRET') || 'this-is-a-secret', // get this from env vars
      jwtOptions: {
        expiresIn: configService.get('MAGIC_LOGIN_EXPIRY') || '5m',
      },
      callbackUrl: `${configService.get(
        'FRONTEND_URL',
      )}/auth/passwordless/callback`,
      sendMagicLink: async (destination: string, href: string) => {
        const settings = (await this.settingsService.getSettings()).data;
        const res = (await this.usersService.getUserUsingEmail(destination))
          .data;
        const user: User = res.user;

        // send the email to the user
        const mail: SendEmail = {
          subject: 'Magic Login Link',
          recipient: destination,
          textAlignment: 'left',
          hasHero: false,
          html: MagicLoginLinkTemplate(
            settings,
            { name: user.name, email: destination },
            href,
          ),
        };
        await notificationService.dispatchEmail(mail);
      },
      verify: async (
        payload: MagicLoginPayload,
        callback: (arg0: null, arg1: Promise<any>) => any,
      ) => {
        return callback(null, this.validate(payload));
      },
    });
  }

  async validate(payload: MagicLoginPayload) {
    const res = (await this.usersService.getUserUsingEmail(payload.destination))
      .data;
    const user = res.user;
    if (!user) {
      return null;
    }
    return res;
  }
}
