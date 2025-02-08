import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { AuthenticationGuard } from './auth/guards/authentication.guard';
import { CustomHttpResponse } from './shared';
import { GenericResponse } from './shared/decorators/generic-response.decorator';
import { ReleasesDto } from './shared/dto/releases.dto';

@Controller()
@ApiExcludeController()
export class AppController {
  /**
   * Creates an instance of AppController.
   * @param {AppService} appService
   * @memberof AppController
   */
  constructor(private readonly appService: AppService) {
    //
  }

  /**
   * Check connection to the api
   *
   * @return {*}  {string}
   * @memberof AppController
   */
  @Get()
  async healthStatus(
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    const response = await this.appService.healthStatus();
    // Set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Sync database. The function emits an event to seed database everywhere within the app
   * @param req
   */
  @Post('sync-database')
  @UseGuards(AuthenticationGuard)
  async syncDefaultData(@Req() req: any): Promise<CustomHttpResponse> {
    const userId: string = req.user._id.toString();
    return this.appService.syncSystem(userId);
  }

  /**
   * Push out a new release
   *
   * @param {ReleasesDto} body
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof AppController
   */
  @Post('new-release')
  async sendNewRelease(@Body() body: ReleasesDto): Promise<CustomHttpResponse> {
    return await this.appService.sendNewRelease(body);
  }
}
