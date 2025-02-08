import { CustomHttpResponse } from 'src/shared';
import { GenericResponse } from 'src/shared/decorators/generic-response.decorator';
import { RegionsService } from './../services/regions.service';
import { Controller, Get } from '@nestjs/common';

@Controller('regions')
export class RegionsController {
  /**
   * Creates an instance of RegionsController.
   * @param {RegionsService} regionsService
   * @memberof RegionsController
   */
  constructor(private readonly regionsService: RegionsService) {}

  /**
   * Get all the supported countries
   *
   * @param {GenericResponse} res
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof RegionsController
   */
  @Get('countries')
  async getSupportedCountries(
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    // get the countries
    const response = await this.regionsService.getSupportedCountries();
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }

  /**
   * Get all countries
   *
   * @param {GenericResponse} res
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof RegionsController
   */
  @Get('countries/all')
  async getAllCountries(
    @GenericResponse() res: GenericResponse,
  ): Promise<CustomHttpResponse> {
    // get the countries
    const response = await this.regionsService.getAllCountries();
    // set response status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }
}
