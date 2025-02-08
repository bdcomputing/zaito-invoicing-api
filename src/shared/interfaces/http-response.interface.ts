import { HttpStatusCodeEnum } from '../enums/status-codes.enum';

export interface HttpResponseInterface {
  statusCode: HttpStatusCodeEnum;
  message: string;
  data: any;
}
