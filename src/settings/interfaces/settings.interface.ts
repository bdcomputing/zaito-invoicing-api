import { StorageConfigsServiceJson } from './gcs.interface';

export interface Address {
  boxAddress: string;
  town: string;
  building?: string;
  street?: string;
  postalCode: string;
  country: string;
}

export interface GeneralSettings {
  app: string;
  company: string;
  email: string;
  phone: string;
  KRA: string;
  address: Address;
}
export interface FacebookApp {
  FACEBOOK_APP_ID: string;
  FACEBOOK_APP_SECRET: string;
  FACEBOOK_RECIPIENT_WAID: string;
  FACEBOOK_VERSION: string;
  FACEBOOK_PHONE_NUMBER_ID: string;
  FACEBOOK_ACCESS_TOKEN: string;
}

export interface StorageSettings {
  gcs?: {
    serviceAccount: StorageConfigsServiceJson;
    bucketName: string;
  };
}

export interface Branding {
  logo: string;
  logoFile?: object;
  darkLogo: string;
  favicon: string;
}
export interface APIAuthParams {
  email: string;
  password: string;
}

export interface CurrencyConversion {
  currency: string;
  rate: number | string;
}

export interface Settings {
  general: GeneralSettings;
  balanceBroughtForwardDate?: Date;
  mail?: {
    port: number;
    auth: {
      user: string;
      pass: string;
    };
    host: string;
    from: string;
  };
  branding: Branding;
  appURL: string;
  currencyConversionAgainstUSD?: CurrencyConversion[];
  storage?: StorageSettings;
  createdBy?: string;
}
export interface SystemSettings extends Settings {
  _id: string;
}
