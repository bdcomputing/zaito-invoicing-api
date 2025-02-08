import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { defaultSettings } from '../data/settings.data';
import { Model } from 'mongoose';
import {
  SettingsInterface,
  SystemSettingsInterface,
} from '../interfaces/settings.interface';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { OnEvent } from '@nestjs/event-emitter';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { DatabaseModelEnums } from 'src/database/enums/database.enum';
import { LogoUploadedResponseDto } from 'src/file-manager/google-cloud-storage/dtos/logo-uploaded.dto';
import { Cache } from '@nestjs/cache-manager';
import { UpdateGeneralSettingsDto } from '../dto/update-general-settings.dto';
import { UpdateEmailSettingsDto } from '../dto/update-email-settings.dto';
import { UpdateBrandingSettingsDto } from '../dto/update-branding-settings.dto';

@Injectable()
export class SettingsService implements OnModuleInit {
  private readonly logger = new Logger(SettingsService.name);
  /**
   * Creates an instance of SettingsService.
   * @param {Model<SettingsInterface>} settings
   * @memberof SettingsService
   */
  constructor(
    @Inject('CACHE_MANAGER') private readonly cacheManager: Cache,
    @Inject(DatabaseModelEnums.SETTING_MODEL)
    private readonly settings: Model<SettingsInterface>,
  ) {}
  /**
   * Initialize the settings service on Module Init
   * This method is called by NestJS after the module has been initialized
   * and all controllers, providers, etc. have been registered.
   * We use this opportunity to seed the settings data into the database
   * with a default user (null) if no settings are found.
   * @return {Promise<void>}
   * @memberof SettingsService
   */
  async onModuleInit() {
    await this.seed({ userId: null });
    this.updateCache();
  }
  /**
   * Sync Settings to the database
   *
   * @param {string} userId
   * @return {*}
   * @memberof SettingsService
   */
  @OnEvent(SystemEventsEnum.SyncDatabase, { async: true })
  async seed(data: { userId: string; appURL?: string } | string) {
    const settings = await this.settings.find().exec();
    const defaultData = defaultSettings();
    const d: any = data as any;
    let appUrl = defaultData.appURL;
    let userId = d;
    if (data.hasOwnProperty('userId')) {
      appUrl = d.appURL ? d.appURL : defaultData.appURL;
      userId = d.userId;
    }

    const payload: SettingsInterface = defaultData as any;
    payload.appURL = appUrl ? appUrl : defaultData.appURL;
    payload.createdBy = userId;
    if (settings.length === 0) {
      await this.settings.create(payload);
      this.logger.log('Settings seeded successfully');
    }
  }

  /**
   * Get System Settings
   *
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof SettingsService
   */
  async getSettings(): Promise<CustomHttpResponse> {
    const cachedData = await this.cacheManager.get('/api/settings');
    let settings;
    if (cachedData) {
      settings = cachedData;
    } else {
      const _settings = await this.settings.find().exec();
      settings = _settings[0];
    }

    return new CustomHttpResponse(
      HttpStatusCodeEnum.OK,
      'Settings loaded successfully',
      settings,
    );
  }

  /**
   * Update General Settings
   *
   * @param {string} id
   * @param {UpdateGeneralSettingsDto} payload
   * @return {*}  {Promise<SettingsInterface>}
   * @memberof SettingsService
   */
  async updateGeneralSettings(
    payload: UpdateGeneralSettingsDto,
  ): Promise<CustomHttpResponse> {
    const settings: SettingsInterface = (await this.getSettings()).data;
    const id = (await this.getSettings()).data._id;
    let general = settings.general;
    general = { ...general, ...payload };

    // update the settings
    const updatedSettings = await this.settings
      .findByIdAndUpdate(
        id,
        { general },
        {
          returnOriginal: false,
        },
      )
      .exec();

    this.updateCache(updatedSettings);

    return new CustomHttpResponse(
      HttpStatusCodeEnum.OK,
      'General settings updated successfully',
      updatedSettings,
    );
  }

  /**
   * Update Email Settings
   *
   * @param {string} id
   * @param {UpdateEmailSettingsDto} payload
   * @return {*}  {Promise<SettingsInterface>}
   * @memberof SettingsService
   */
  async updateEmailSettings(
    payload: UpdateEmailSettingsDto,
  ): Promise<CustomHttpResponse> {
    const settings: SettingsInterface = (await this.getSettings()).data;
    const id = (await this.getSettings()).data._id;
    let mail = settings.mail;
    mail = { ...mail, ...payload };

    // update the settings
    const updatedSettings = await this.settings
      .findByIdAndUpdate(
        id,
        { mail },
        {
          returnOriginal: false,
        },
      )
      .exec();

    this.updateCache(updatedSettings);

    return new CustomHttpResponse(
      HttpStatusCodeEnum.OK,
      'Email settings updated successfully',
      updatedSettings,
    );
  }

  /**
   * Update Branding Settings
   *
   * @param {string} id
   * @param {UpdateBrandingSettingsDto} payload
   * @return {*}  {Promise<SettingsInterface>}
   * @memberof SettingsService
   */
  async updateBrandingSettings(
    payload: UpdateBrandingSettingsDto,
  ): Promise<CustomHttpResponse> {
    const settings: SettingsInterface = (await this.getSettings()).data;
    const id = (await this.getSettings()).data._id;
    let mail = settings.mail;
    mail = { ...mail, ...payload };

    // update the settings
    const updatedSettings = await this.settings
      .findByIdAndUpdate(
        id,
        { mail },
        {
          returnOriginal: false,
        },
      )
      .exec();

    this.updateCache(updatedSettings);

    return new CustomHttpResponse(
      HttpStatusCodeEnum.OK,
      'Branding settings updated successfully',
      updatedSettings,
    );
  }
  @OnEvent(SystemEventsEnum.CompanyLogoUploaded, { async: true })
  async updateCompanyLogo(
    response: LogoUploadedResponseDto,
  ): Promise<CustomHttpResponse> {
    const settings: SystemSettingsInterface = (await this.getSettings()).data;

    if (settings) {
      settings.branding.logo = response.metadata.mediaLink;
      settings.branding.logoFile = response.metadata;

      const filter = { _id: settings._id };

      await this.settings.findOneAndUpdate(filter, settings, {
        returnOriginal: false,
      });
      this.updateCache();
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'company logo updated successfully',
        null,
      );
    }
  }

  async updateCache(settings?: SettingsInterface) {
    let data: SettingsInterface | null = null;
    if (settings) {
      data = settings;
    } else {
      const _settings: SettingsInterface[] = await this.settings.find().exec();
      if (_settings.length > 0) {
        data = _settings[0];
      }
    }
    if (data) {
      await this.cacheManager.set('/api/settings', data, 0);
    }
  }
}
