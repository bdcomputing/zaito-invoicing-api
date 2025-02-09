import { HttpStatusCodeEnum } from '../enums/status-codes.enum';

export interface HttpResponse {
  statusCode: HttpStatusCodeEnum;
  message: string;
  data: any;
}
