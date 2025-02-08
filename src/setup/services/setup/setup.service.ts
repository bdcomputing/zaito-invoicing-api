import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthorizationService } from 'src/authorization/services/authorization.service';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { SettingsService } from 'src/settings/services/settings.service';
import { SyncSuperAdminDto } from 'src/setup/dto/sync-db.dto';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { UserAutomationService } from 'src/users/services/user-automation.service';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class SetupService {
  private logger = new Logger(SetupService.name);
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly authorizationService: AuthorizationService,
    private readonly usersService: UsersService,
    private readonly usersAutomationService: UserAutomationService,
    private readonly settingsService: SettingsService,
  ) {
    //
  }

  /**
   * Syncs the super admin user account on startup.
   * - Gets the admin role ID.
   * - Generates a random password.
   * - Creates a new employee user with admin role.
   * - Hashes the password.
   * - Checks if email/phone already exists.
   * - Saves the new user.
   * - Emits events to notify of new super user and sync their DB.
   * - Returns a response.
   * @param {SyncSuperAdminDto} payload
   * @returns {Promise<CustomHttpResponse>}
   */
  async createSuperUser(
    payload: SyncSuperAdminDto,
  ): Promise<CustomHttpResponse> {
    try {
      await this.authorizationService.syncPermissions();
      let appURL: string | null;

      // check if it ends with '/'
      if (payload.appURL && payload.appURL.endsWith('/')) {
        appURL = payload.appURL.substring(0, payload.appURL.length - 1) || null;
      } else {
        appURL = payload.appURL || null;
      }

      // get all the users
      const users: UserInterface[] | null = (
        await this.usersService.getAllUsers()
      ).data;
      let user: UserInterface | null | undefined;
      if (users && users.length > 0) {
        user = users.find((user: UserInterface) => {
          return user.email === payload.email;
        });
      } else {
        // create a new user
        user = (await this.usersAutomationService.syncAdminUser(payload)).data;
      }

      if (!user) {
        throw new Error('User not found');
      }
      // sync settings
      await this.settingsService.seed({
        userId: user._id.toString(),
        appURL,
      });

      this.eventEmitter.emit(
        SystemEventsEnum.SyncDatabase,
        user._id.toString(),
      );

      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Super Admin Sync initiated successfully!',
        null,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
