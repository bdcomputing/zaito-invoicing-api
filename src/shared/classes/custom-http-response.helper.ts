import { HttpStatusCodeEnum } from '../enums/status-codes.enum';
import { apiVersion } from '../utils/version.util';

export class CustomHttpResponse {
  statusCode: HttpStatusCodeEnum;
  message: string;
  data: any;
  apiVersion: string;

  /**
   * Creates an instance of CustomHttpResponse.
   * @param {HttpStatusCodeEnum} statusCode
   * @param {string} message
   * @param {*} data
   * @memberof CustomHttpResponse
   */
  constructor(statusCode: HttpStatusCodeEnum, message: string, data: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.apiVersion = `v${apiVersion}`;
  }
}
