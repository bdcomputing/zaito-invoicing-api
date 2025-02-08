import {
  BrandingInterface,
  StorageSettingsInterface,
} from './settings.interface';

export interface ClinicSettingsInterface {
  clinicId: string;
  isMailCredentialsDefault: boolean;
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
  storage?: StorageSettingsInterface;
  createdBy?: string;
}

export interface SystemSettingsInterface extends ClinicSettingsInterface {
  _id: string;
}
