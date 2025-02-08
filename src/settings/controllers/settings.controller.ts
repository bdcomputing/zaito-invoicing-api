import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { SettingsService } from '../services/settings.service';
import { ApiTags } from '@nestjs/swagger';
import { CustomHttpResponse } from 'src/shared';
import { RequiredPermissions } from 'src/authorization/decorators/permissions.decorator';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { PermissionsGuard } from 'src/authorization/guards/permission.guard';
import { PermissionEnum } from 'src/authorization/enums/permission.enum';
import { GenericResponse } from 'src/shared/decorators/generic-response.decorator';
import { UpdateGeneralSettingsDto } from '../dto/update-general-settings.dto';
import { UpdateEmailSettingsDto } from '../dto/update-email-settings.dto';
import { UpdateBrandingSettingsDto } from '../dto/update-branding-settings.dto';
import { SequenceService } from 'src/database/services/sequence.service';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  /**
   * Creates an instance of SettingsController.
   * @param {SettingsService} settingsService
   * @memberof SettingsController
   */
  constructor(
    private readonly settingsService: SettingsService,
    private readonly sequenceService: SequenceService,
  ) {
    //
  }

  /**
   * Get All Settings
   *
   * @param {GenericResponse} res
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof SettingsController
   */
  @Get()
  async getSettings(
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    // Get all system settings
    const response = await this.settingsService.getSettings();
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Update general settings
   *
   * @param {UpdateGeneralSettingsDto} body
   * @param {GenericResponse} res
   * @return {*}
   * @memberof SettingsController
   */
  @Patch('general')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @RequiredPermissions(PermissionEnum.UPDATE_SETTINGS)
  async updateGeneralSettings(
    @Body() body: UpdateGeneralSettingsDto,
    @GenericResponse() res: GenericResponse,
  ) {
    const response = await this.settingsService.updateGeneralSettings(body);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Update email settings
   *
   * @param {UpdateEmailSettingsDto} body
   * @param {GenericResponse} res
   * @return {*}
   * @memberof SettingsController
   */
  @Patch('email')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @RequiredPermissions(PermissionEnum.UPDATE_SETTINGS)
  async updateEmailSettings(
    @Body() body: UpdateEmailSettingsDto,
    @GenericResponse() res: GenericResponse,
  ) {
    const response = await this.settingsService.updateEmailSettings(body);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Update email settings
   *
   * @param {UpdateBrandingSettingsDto} body
   * @param {GenericResponse} res
   * @return {*}
   * @memberof SettingsController
   */
  @Patch('branding')
  @UseGuards(AuthenticationGuard, PermissionsGuard)
  @RequiredPermissions(PermissionEnum.UPDATE_SETTINGS)
  async updateBrandingSettings(
    @Body() body: UpdateBrandingSettingsDto,
    @GenericResponse() res: GenericResponse,
  ) {
    const response = await this.settingsService.updateBrandingSettings(body);
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Gets the sequence from the sequence service.
   */
  @Get('sequence')
  async getSequence() {
    return await this.sequenceService.getSequence();
  }
}
