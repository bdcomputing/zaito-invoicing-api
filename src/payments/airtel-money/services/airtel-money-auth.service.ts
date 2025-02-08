import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { log } from 'console';
import { airtelMoneyConfig } from '../utils/airtel-money.config';
import { AirtelMoneyRoutes } from '../utils/routes.constants';

@Injectable()
export class AirtelMoneyAuthService {
  /**
   * AirtelMoneyAuthService constructor
   *
   * @param {HttpService} httpService The HTTP client to make requests to the Airtel Money API
   */
  constructor(private readonly httpService: HttpService) {}
  /**
   * Gets the access token from the Airtel Money API
   *
   * @returns {Promise<string | null>} The access token or null if an error occurred
   */
  async getAccessToken(): Promise<string | null> {
    try {
      const { data } = await this.httpService.axiosRef.post(
        `${airtelMoneyConfig.baseURL}/${AirtelMoneyRoutes.AUTH}`,
        {
          client_id: airtelMoneyConfig.clientID,
          client_secret: airtelMoneyConfig.clientSecret,
          grant_type: 'client_credentials',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const { access_token } = data;
      return access_token;
    } catch (error) {
      log(error);
      return null;
    }
  }
}
