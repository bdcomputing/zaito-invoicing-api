import { StorageConfigsServiceJsonInterface } from './gcs.interface';

export interface AddressInterface {
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
  address: AddressInterface;
}
export interface FacebookAppInterface {
  FACEBOOK_APP_ID: string;
  FACEBOOK_APP_SECRET: string;
  FACEBOOK_RECIPIENT_WAID: string;
  FACEBOOK_VERSION: string;
  FACEBOOK_PHONE_NUMBER_ID: string;
  FACEBOOK_ACCESS_TOKEN: string;
}

export interface StorageSettingsInterface {
  gcs?: {
    serviceAccount: StorageConfigsServiceJsonInterface;
    bucketName: string;
  };
}

export interface BrandingInterface {
  logo: string;
  logoFile?: object;
  darkLogo: string;
  favicon: string;
}
export interface APIAuthParamsInterface {
  email: string;
  password: string;
}

export interface CurrencyConversionInterface {
  currency: string;
  rate: number | string;
}

export interface SettingsInterface {
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
  branding: BrandingInterface;
  appURL: string;
  currencyConversionAgainstUSD?: CurrencyConversionInterface[];
  storage?: StorageSettingsInterface;
  createdBy?: string;
}
export interface SystemSettingsInterface extends SettingsInterface {
  _id: string;
}
