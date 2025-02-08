import { AirtelMoneyRoutes } from './routes.constants';

export enum AirtelMoneyEnvironmentEnum {
  'process.env.AIRTEL_MONEY_ENVIRONMENT',
  'production',
  'sandbox',
}

export interface AirtelMoneyConfigInterface {
  clientID: string;
  clientSecret: string;
  environment: AirtelMoneyEnvironmentEnum;
  baseURL: string;
}
const baseURL =
  (process.env
    .AIRTEL_MONEY_ENVIRONMENT as unknown as AirtelMoneyEnvironmentEnum) ===
  AirtelMoneyEnvironmentEnum.production
    ? AirtelMoneyRoutes.production
    : AirtelMoneyRoutes.sandbox;

// configuration
export const airtelMoneyConfig: AirtelMoneyConfigInterface = {
  clientID: process.env.AIRTEL_MONEY_CLIENT_ID,
  clientSecret: process.env.AIRTEL_MONEY_CLIENT_SECRET,
  environment: process.env
    .AIRTEL_MONEY_ENVIRONMENT as unknown as AirtelMoneyEnvironmentEnum,
  baseURL,
};
