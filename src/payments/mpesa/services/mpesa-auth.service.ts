import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { mpesaConfig } from '../utils/mpesa.config';

@Injectable()
export class MpesaAuthService {
  private logger = new Logger(MpesaAuthService.name);

  /**
   * Generate Access Token
   *
   * @return {*}  {Promise<string>}
   * @memberof MpesaAuthService
   */
  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`,
    ).toString('base64');

    try {
      const response = await axios.get(
        `${mpesaConfig.baseURL}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        },
      );

      return response.data.access_token;
    } catch (error) {
      throw new Error('Failed to get M-Pesa access token');
    }
  }

  // Register URLs with Safaricom
  async registerC2BUrls(): Promise<void> {
    const accessToken = await this.getAccessToken();

    const requestBody = {
      ShortCode: mpesaConfig.ShortCode,
      ResponseType: 'Completed', // You can use 'Cancelled' if you want
      ConfirmationURL: `${mpesaConfig.confirmationUrl}`,
      ValidationURL: `${mpesaConfig.validationUrl}`,
    };

    try {
      const response = await axios.post(
        `${mpesaConfig.baseURL}/mpesa/c2b/v1/registerurl`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const res: any = response.data;

      if (
        (res.ResponseDescription as string).toLowerCase().includes('success')
      ) {
        this.logger.warn('Mpesa Urls registered Successfully');
      } else {
        this.logger.error(res.ResponseDescription);
      }

      // console.log('C2B URL registration response:', response.data);
    } catch (error) {
      // console.error(
      //   'Failed to register C2B URLs:',
      //   error.response?.data || error.message,
      // );
      this.logger.error('Failed to register C2B URLs: ' + error.message);
      throw new Error('Failed to register C2B URLs');
    }
  }
}
