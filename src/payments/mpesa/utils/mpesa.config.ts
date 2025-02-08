import { MpesaEndpointName } from '../enums/constants';
import { MpesaControllerRouteNames, MpesaRoutes } from './routes.constants';

export enum MpesaEnvironmentEnum {
  'process.env.MPESA_ENVIRONMENT',
  'production',
  'sandbox',
}

export interface MpesaConfigInterface {
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  ShortCode: string;
  environment: MpesaEnvironmentEnum;
  callbackUrl: string;
  confirmationUrl: string;
  validationUrl: string;
  SecurityCredential: string;
  Initiator: string;
  baseURL: string;
}

const baseURL =
  (process.env.AIRTEL_MONEY_ENVIRONMENT as unknown as MpesaEnvironmentEnum) ===
  MpesaEnvironmentEnum.production
    ? MpesaRoutes.production
    : MpesaRoutes.sandbox;

export const mpesaConfig: MpesaConfigInterface = {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  passkey: process.env.MPESA_PASS_KEY,
  ShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
  environment: process.env.MPESA_ENVIRONMENT as unknown as MpesaEnvironmentEnum,
  callbackUrl: `${process.env.MPESA_SERVER_URL}/${MpesaEndpointName}/${MpesaControllerRouteNames.CALLBACK}`,
  confirmationUrl: `${process.env.MPESA_SERVER_URL}/${MpesaEndpointName}/${MpesaControllerRouteNames.CALLBACK}`,
  validationUrl: `${process.env.MPESA_SERVER_URL}/${MpesaEndpointName}/${MpesaControllerRouteNames.VALIDATION}`,
  SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
  Initiator: process.env.MPESA_INITIATOR,
  baseURL,
};
